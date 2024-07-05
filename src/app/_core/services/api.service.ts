import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerConfigService } from './server-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public readonly apiUrl;

  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {
    this.apiUrl = this.serverConfig.server;
  }

  get<T>(path: string, params = {}, headers = {}, options = {}) {
    return this.http.get<T>(`${this.apiUrl}${path}`, { params, headers, ...options});
  }

  put(path: string, body = {}, params = {}) {
    return this.http.put(`${this.apiUrl}${path}`, body, { params });
  }
  
  post<T>(path: string, body = {}, params = {}, headers = {}) {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, { params, headers });
  }

  patch<T>(path: string, body = {}, params = {}, headers = {}) {
    return this.http.patch<T>(`${this.apiUrl}${path}`, body, { params, headers });
  }


  delete<T>(path: string, params = {}) {
    return this.http.delete<T>(`${this.apiUrl}${path}`, { params });
  }
}
