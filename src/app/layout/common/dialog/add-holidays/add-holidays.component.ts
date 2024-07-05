import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HolidaysService } from 'app/_core/api/holidays.service';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { LeaveTypes } from 'app/_core/models/holidays.types';
import { DialogService } from 'app/_core/services/dialog.service';
import {MatTabsModule} from '@angular/material/tabs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { AutomaticHolidaysComponent } from '../../automatic-holidays/automatic-holidays.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import Utils from 'app/_core/helpers/utils';
import { UserService } from 'app/_core/services/user.service';
import { Employee } from 'app/_core/models/employee.types';

@Component({
    selector: 'app-add-holidays',
    standalone: true,
    imports: [
        CommonModule,FormsModule, ReactiveFormsModule, MatFormFieldModule, MatTabsModule, MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatIconModule, MatTooltipModule, AutomaticHolidaysComponent
    ],
    templateUrl: './add-holidays.component.html',
    styleUrl: './add-holidays.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:[
    ]
})
export class AddHolidaysComponent implements OnInit{

    holidaysType: LeaveTypes[] = [];
    holidaysTypeSelected: number = 1;


    manualInputForm: FormGroup;
    user:Employee;
    constructor(private fb:FormBuilder ,private _dialogService: DialogService, private _holidaysService: HolidaysService, private userService: UserService) { }

    ngOnInit(): void {
        this.getHolidays();
        this.manualInputForm = this.fb.group({
            startDate: new FormControl('',[Validators.required]),
            endDate: new FormControl('',[Validators.required]),
            holidayType: new FormControl(1, [Validators.required]),
        });
        this.userService.userData$.subscribe((data:Employee) => {
            this.user = data;
        });
    }
        
    getHolidays() {
        this._holidaysService.getHolidays().subscribe((data:GenericReponse<LeaveTypes[]>) => {
            this.holidaysType = data.data;
        });
    }

    exit(){
        this._dialogService.closeModal();
    }


    addManualHoliday(){
        if(!this.manualInputForm.valid){
            return;
        }
        var workingDays = 0;
        var workingDays = Utils.getWorkingDays(this.startDate.value, this.endDate.value);
        if(workingDays > this.user.remainingLeaves){
            Swal.fire("Error", "You don't have enough leaves", "error");
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You are about to add "+workingDays+" days of holiday",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                this._holidaysService.addHolidays({
                    employeeId : this.user.id,
                    startDate: this.startDate.value,
                    endDate: this.endDate.value,
                    leaveType: this.holidayType.value
                }).subscribe({
                    next: () => {
                        Swal.fire("Success", "Holiday added successfully", "success").then(()=>{ this._dialogService.closeModal(); });
                    },
                    error:()=>{
                        Swal.fire("Error", "Something went wrong", "error");
                    }
                })
            }
        });
    }
    
    get startDate() { return this.manualInputForm.get('startDate'); }
    get endDate() { return this.manualInputForm.get('endDate'); }
    get holidayType() { return this.manualInputForm.get('holidayType'); }
}

