import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Cacheable } from '../decorators/cacheable.decorator';

@Injectable({
    providedIn: 'root'
})
export class HolidaysService {

    private readonly authUrl = 'Leaves';

    constructor(
        private _apiService: ApiService
    ) { }

    @Cacheable()
    getHolidays() {
        return this._apiService.get(`${this.authUrl}/get-leaves-type`);
    }

    addHolidays(data: any) {
        return this._apiService.post(`${this.authUrl}/add-leave`, data);
    }

    @Cacheable()
    getLeaves(id: number = -1) {
        return this._apiService.get(`${this.authUrl}/get-leaves/${id}`);
    }

    @Cacheable()
    getApproveLeaves() {
        return this._apiService.get(`${this.authUrl}/get-approve-leaves`);
    }

    changeStatusLeave(id: number, status: boolean) {
        return this._apiService.post(`${this.authUrl}/change-status-leave/${id}/${status}`);
    }

    @Cacheable()
    getBestLeaveDate(year: number, month: number, days: number) {
        return this._apiService.get(`${this.authUrl}/get-all-teams-leaves/-1?year=${year}&month=${month}&days=${days}`);
    }
}
