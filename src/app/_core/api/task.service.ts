import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Cacheable } from '../decorators/cacheable.decorator';
import { AssignEmployeeToTaskRequest } from '../models/task.types';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly url = 'Task';

  constructor(
    private _apiService: ApiService
  ) { }

  getWorkloadBySprintId(id: number = null) {
    return this._apiService.get(`${this.url}/${id}`);
  }

  assigneEmployeeToTask(data: AssignEmployeeToTaskRequest) {
    return this._apiService.post(`${this.url}/assign-employee-to-task`, data);
  }

  addComment(data: any) {
    return this._apiService.post(`${this.url}/add-task-comments`, data);
  }

  addAttachment(data: any) {
    return this._apiService.post(`${this.url}/add-task-attachments`, data);
  }

  downloadTaskAttachment(id: number) {
    return this._apiService.get(`${this.url}/download-task-attachment/${id}`, {}, { responseType: 'blob', observe: 'response'});
  }

  logTime(data: any) {
    return this._apiService.post(`${this.url}/add-task-log-work`, data);
  }

  getWorkLogsByEmployee(){
    return this._apiService.get(`${this.url}/get-worklogs-by-employee`);
  }

  getWorkLogsByEmployeeById(id: number = null) {
    return this._apiService.get(`${this.url}/get-worklogs-by-employee/${id}`);
  }
  
}
