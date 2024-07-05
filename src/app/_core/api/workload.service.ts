import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Cacheable } from '../decorators/cacheable.decorator';

@Injectable({
  providedIn: 'root'
})
export class WorkloadService {

  private readonly url = 'Workload';

  constructor(
    private _apiService: ApiService
  ) { }

  getWorkloadBySprintId(id: number = null) {
    return this._apiService.get(`${this.url}/${id}`);
  }

  createWorkload(data: any) {
    return this._apiService.post(`${this.url}/create-update-workload`, data);
  }

  addLeavesWorkload(data: any) {
    return this._apiService.post(`${this.url}/add-leaves-workload`, data);
  }
}
