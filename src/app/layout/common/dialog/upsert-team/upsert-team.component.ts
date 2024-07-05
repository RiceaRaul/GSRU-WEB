import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from 'app/_core/api/employee.service';
import { TeamService } from 'app/_core/api/team.service';
import { Employee } from 'app/_core/models/employee.types';
import { DialogService } from 'app/_core/services/dialog.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-upsert-team',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule
    ],
    templateUrl: './upsert-team.component.html',
    styleUrl: './upsert-team.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTeamComponent implements OnInit{ 
    
    employees: Employee[] = [];
    teamForm: FormGroup;
    isUpdate: boolean = false;
    constructor(private dialogSerivce: DialogService, private fb: FormBuilder, private employeeService: EmployeeService, private changeDetectorRef: ChangeDetectorRef, private teamService: TeamService) {}

    ngOnInit(): void {
        this.teamForm = this.fb.group({
            TeamId: [null],
            TeamName: ['', [Validators.required]],
            TeamLeadId:[1, [Validators.required]]
        });

        var dialogParams = this.dialogSerivce.params;
        if(Object.hasOwn(dialogParams, 'teamId')){
            this.teamId.setValue(dialogParams.teamId);
            this.teamName.setValue(dialogParams.teamName);
            this.teamLeadId.setValue(dialogParams.teamLeadId);
            this.isUpdate = true;
        }
        
        this.employeeService.getEmployees().subscribe({
            next: (employees:Employee[]) => {
                this.employees = employees;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    closeDialog(): void {
        this.dialogSerivce.closeAll();
    }

    upsertTeam(){
        if(this.teamForm.invalid){
            return;
        }

        this.teamService.upsertTeam(this.teamForm.value).subscribe({
            next: () => {
                Swal.fire('Success', 'Team upserted successfully', 'success').then(()=>{
                    this.closeDialog();
                });
            },
            error: () => {
                console.error('An error occured while upserting team');
            }
        })
    }

    get teamId(){
        return this.teamForm.get('TeamId');
    }

    get teamName(){
        return this.teamForm.get('TeamName');
    }

    get teamLeadId(){
        return this.teamForm.get('TeamLeadId');
    }
}
