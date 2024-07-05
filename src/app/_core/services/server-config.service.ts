import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, first, tap, throwError } from 'rxjs';
import { ServerConfig } from '../models/server-config.types';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {

  private serverConfig?: ServerConfig;

  constructor(private httpClient: HttpClient) {
    this.loadServerConfig().pipe(first()).subscribe();
   }

  loadServerConfig() {

    return this.httpClient.get("../../../assets/server-config/server-config.json").pipe(
      tap((response: ServerConfig) => {
        this.serverConfig = response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => error);
      })
    )
  }

  get server() {
    if(!this.serverConfig){
      throw Error("Server config could not be loaded");
    }

    return this.serverConfig.server;
  }

  get serverHub() {
    if(!this.serverConfig){
      throw Error("Server config could not be loaded");
    }

    return this.serverConfig.serverHub;
  }

  get appName() {
    if(!this.serverConfig){
      throw Error("Server config could not be loaded");
    }

    return this.serverConfig.appName;
  }
}
