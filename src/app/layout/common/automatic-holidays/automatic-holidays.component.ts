import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HolidaysService } from 'app/_core/api/holidays.service';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { Employee } from 'app/_core/models/employee.types';
import { DialogService } from 'app/_core/services/dialog.service';
import { UserService } from 'app/_core/services/user.service';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import Swal from 'sweetalert2';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    }
}
@Component({
    selector: 'app-automatic-holidays',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule
    ],
    templateUrl: './automatic-holidays.component.html',
    styleUrl: './automatic-holidays.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:[
        provideMomentDateAdapter(MY_FORMATS)
    ]
})
export class AutomaticHolidaysComponent implements OnInit{ 

    automaticHolidays = new FormControl(null,[Validators.required]);
    automaticHolidaysDays = new FormControl(0,[Validators.required]);
    user:Employee;
    constructor(private holidayService: HolidaysService, private userService: UserService, private _dialogService: DialogService) {}

    ngOnInit(): void {
        this.userService.userData$.subscribe((data:Employee) => {
            this.user = data;
        });
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.automaticHolidays.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.automaticHolidays.setValue(ctrlValue);
        datepicker.close();
    }

    calculate(){
        if(this.automaticHolidays.invalid || this.automaticHolidaysDays.invalid){
            return;
        }
        var month = this.automaticHolidays.value.month() + 1;
        var year = this.automaticHolidays.value.year();
        var days = this.automaticHolidaysDays.value;
        this.holidayService.getBestLeaveDate(year,month, days).subscribe({
            next: (res: GenericReponse<Date>) => {
                if(res.data != null){
                    var date = moment(new Date(res.data));
                    date.add(days,'day');
                    Swal.fire({
                        title: "Best Leave Date",
                        text: `The best leave interval is ${moment(res.data).format('YYYY-MM-DD')} - ${date.format('YYYY-MM-DD')}. Do you want to proceed?`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.holidayService.addHolidays({
                                employeeId : this.user.id,
                                startDate: res.data,
                                endDate: date,
                                leaveType: 2
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
                }else{
                    Swal.fire('Warning','No best leave interval found','warning');
                }
                
            },
            error:()=>{
                Swal.fire('Error','An error occured while calculating the best leave date','error');
            }
        })
    }
}
