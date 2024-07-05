import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Cacheable } from '../decorators/cacheable.decorator';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly authUrl = 'Team';

  constructor(
    private _apiService: ApiService
  ) { }

  @Cacheable()
  getMemberOverView(id: number = null) {
    return this._apiService.get(`${this.authUrl}/get-member-overview/${id}`);
  }

  getTeams() {
    return this._apiService.get(`${this.authUrl}/get-all-teams`);
  }

  upsertTeam(team: any) {
    return this._apiService.post(`${this.authUrl}/upsert-team`, team);
  }
}
