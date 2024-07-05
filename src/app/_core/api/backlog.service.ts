import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Cacheable } from '../decorators/cacheable.decorator';

@Injectable({
  providedIn: 'root'
})
export class BacklogService {

  private readonly controller = 'BackLog';

  constructor(
    private _apiService: ApiService
  ) { }

  getBacklog(id: number) {
    return this._apiService.get(`${this.controller}/get-backlog-team/${id}`);
  }

  updateBacklog(list) {
    return this._apiService.post(`${this.controller}/update-task-sprint-and-index`, list);
  }

  createSprint(team_id: number) {
    return this._apiService.post(`${this.controller}/create-sprint/${team_id}`);
  }

  @Cacheable()
  getTaskTypes() {
    return this._apiService.get(`${this.controller}/get-tasks-type`);
  }

  @Cacheable()
  getTaskStatus(board_id: number) {
    return this._apiService.get(`${this.controller}/get-tasks-status/${board_id}`);
  }


  createTask(task) {
    return this._apiService.post(`${this.controller}/create-task`, task);
  }

  startSprint(id,goal) {
    return this._apiService.post(`${this.controller}/start-sprint`, {id, sprintGoal: goal});
  }

  getActiveSprint(team_id) {
    return this._apiService.get(`${this.controller}/get-active-sprint/${team_id}`);
  }

  getBoardConfiguration(team_id) {
    return this._apiService.get(`${this.controller}/get-board-configuration/${team_id}`);
  }

  updateTaskStatus(task_id, status_id) {
    return this._apiService.patch(`${this.controller}/update-task-status`, {taskId:task_id, taskStatus:status_id});
  }

  closeSprint(data) {
    return this._apiService.post(`${this.controller}/close-sprint`, data);
  }
}
