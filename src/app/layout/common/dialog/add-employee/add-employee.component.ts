import { S } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from 'app/_core/api/employee.service';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { Employee } from 'app/_core/models/employee.types';
import { minimumAgeValidator } from 'app/_core/validators/minimumageValidator';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-employee',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule
    ],
    templateUrl: './add-employee.component.html',
    styleUrl: './add-employee.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmployeeComponent implements OnInit{
    employeeForm: FormGroup;
    managers: Employee[] = [];
    constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
        this.employeeForm = this.fb.group({
            firstName: ['',[Validators.required, Validators.minLength(3)]],
            lastName: ['',[Validators.required, Validators.minLength(3)]],
            cnp: ['', [Validators.required]],
            serieNr: ['', [Validators.required]],
            birthDate: ['', [Validators.required, minimumAgeValidator(18)]],
            email: ['', [Validators.required]],
            salary: [0, [Validators.required]],
            phoneNumber: ['', [Validators.required]],
            hireDate: ['', [Validators.required]],
            companyEmail: ['', [Validators.required]],
            totalLeaves: [21, [Validators.required]],
            remainingLeaves: [0, [Validators.required]],
            workHours: [0, [Validators.required]],
            address1: ['', [Validators.required]],
            address2: ['', [Validators.required]],
            managerId: [null, Validators.required],
        });
    }

    ngOnInit(): void {
        this.getManagers();
    }

    onSubmit() {
        if(this.employeeForm.invalid) {
            Swal.fire('Invalid form', 'Please fill all the required fields', 'warning');
            return;
        }

        this.employeeService.addEmployee(this.employeeForm.value).subscribe({
            next: () => {
                Swal.fire('Success', 'Employee added successfully', 'success').then(()=>{
                    window.location.reload();
                });
                
            },
            error: (error) => {
                Swal.fire('Error', 'An error occurred while adding the employee', 'error');
            },
        });
    }

    getManagers(){
        this.employeeService.getEmployeeByRole('Manager').subscribe({
            next: (managers:GenericReponse<Employee[]>) => {
                this.managers = managers.data;
            },
            error: () => {
                Swal.fire('Error', 'An error occurred while getting managers', 'error');
            }
        });
    }

    closeDialog() {
        console.log('close dialog');
    }
}
