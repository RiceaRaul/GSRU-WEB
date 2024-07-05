import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { EmployeeService } from 'app/_core/api/employee.service';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { Employee } from 'app/_core/models/employee.types';
import { DialogService } from 'app/_core/services/dialog.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-update-employee',
    standalone: true,
    imports: [
        CommonModule,FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,MatButtonModule, MatSelectModule
    ],
    templateUrl: './update-employee.component.html',
    styleUrl: './update-employee.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEmployeeComponent implements OnInit {

    employeeForm: FormGroup;
    employee:Employee;
    managers:Employee[] = [];
    constructor(
        private fb: FormBuilder, 
        private dialogService: DialogService, 
        private employeeService: EmployeeService,
        private _router: Router,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.employee = this.dialogService.params.employee;

        this.employeeForm = this.fb.group({
            firstName: [this.employee.firstName],
            lastName: [this.employee.lastName],
            serieNr: [this.employee.serieNr],
            email: [this.employee.email],
            salary: [this.employee.salary],
            phoneNumber: [this.employee.phoneNumber],
            totalLeaves: [this.employee.totalLeaves],
            remainingLeaves: [this.employee.remainingLeaves],
            workHours: [this.employee.workHours],
            address1: [this.employee.address1],
            address2: [this.employee.address2],
            managerId: [this.employee.managerId],
        })
    }
    ngOnInit(): void {
        this.getManagers();
    } 

    onSubmit() {
        if(this.employeeForm.get('managerId').value === undefined) {
            Swal.fire('Manager is required', 'Please select a manager', 'warning');
            return;
        }
        const modifiedValues = this.getModifiedValues();
        if(Object.keys(modifiedValues).length === 0) {
            Swal.fire('No changes detected', 'Please make some changes to update', 'warning');
            return;
        }
        modifiedValues['id'] = this.employee.id;
        this.employeeService.updateEmployee(modifiedValues).subscribe({
            next: () => {
                this.dialogService.closeAll();
                Swal.fire('Employee updated', 'Employee has been updated successfully', 'success');
                window.location.reload();           
            },
            error: () => {
                Swal.fire('Error', 'An error occurred while updating employee', 'error');
            }
        });
    }

    getManagers(){
        this.employeeService.getEmployeeByRole('Manager').subscribe({
            next: (managers:GenericReponse<Employee[]>) => {
                this.managers = managers.data;
                this.employeeForm.get('managerId').setValue(this.employee.managerId);
                this.changeDetectorRef.detectChanges();
            },
            error: () => {
                Swal.fire('Error', 'An error occurred while getting managers', 'error');
            }
        });
    }

    onCancel() {
        this.dialogService.closeAll();
    }

    private getModifiedValues() {

        const modifiedValues = {};
        Object.keys(this.employeeForm.controls).forEach(key => {
            if (this.employeeForm.controls[key].value !== this.employee[key]) {
                modifiedValues[key] = this.employeeForm.controls[key].value;
            }
        });
    
        return modifiedValues;
    }
}

