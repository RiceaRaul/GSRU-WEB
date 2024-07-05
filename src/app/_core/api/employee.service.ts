import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Cacheable } from '../decorators/cacheable.decorator';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly authUrl = 'Employee';

  constructor(
    private _apiService: ApiService
  ) { }

  @Cacheable()
  getEmployeeById(id: number = null) {
    if (!id) {
      return this._apiService.get(`${this.authUrl}/get-employee`);
    }

    return this._apiService.get(`${this.authUrl}/get-employee/${id}`);
  }

  @Cacheable()
  getEmployees() {
    return this._apiService.get(`${this.authUrl}/get-employees`);
  }

  fireEmployee(id: number) {
    return this._apiService.delete(`${this.authUrl}/fire-employee/${id}`);
  }

  updateEmployee(employee: any) {
    return this._apiService.patch(`${this.authUrl}/update-employee`, employee);
  }

  addEmployee(employee: any) {
    return this._apiService.post(`${this.authUrl}/add-employee`, employee);
  }

  addTeamToEmployee(employeeId: number, teamId: number) {
    return this._apiService.post(`${this.authUrl}/add-employee-to-team`, {employeeId, teamId});
  }

  removeEmployeeFromTeam(employeeId: number, teamId: number) {
    return this._apiService.post(`${this.authUrl}/remove-employee-from-team`, {employeeId, teamId});
  }

  getEmployeeByRole(role: string) {
    return this._apiService.get(`${this.authUrl}/get-employee-by-role/${role}`);
  }

  getRoles() {
    return this._apiService.get(`${this.authUrl}/get-roles`);
  }

  //add-employee-role/{id}
  addEmployeeRole(employeeId: number, role: number) {
    return this._apiService.post(`${this.authUrl}/add-employee-role/${employeeId}?roleId=${role}`);
  }

  removeEmployeeRole(employeeId: number, role: string) {
    return this._apiService.delete(`${this.authUrl}/remove-employee-role/${employeeId}?roleName=${role}`);
  }

  getEmployeeHireData(year: number) {
    return this._apiService.get(`${this.authUrl}/get-employee-hire-data/${year}`);
  }
}
