import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user.types';
import { EmployeeService } from '../api/employee.service';
import { Employee } from '../models/employee.types';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _userData: ReplaySubject<Employee> = new ReplaySubject<Employee>(1);

    constructor(private _employeeService: EmployeeService)
    {
    }


    set user(value: User)
    {
        this._user.next(value);
        this._employeeService.getEmployeeById().subscribe((employee: Employee) => {
            this._userData.next(employee);
        });
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    get userData$(): Observable<Employee>
    {
        return this._userData.asObservable();
    }
}
