import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionState, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { Observable, from } from 'rxjs';
import { ServerConfigService } from './server-config.service';
import { StorageService } from './storage.service';
import { HUBS } from '../constants/signalr-sockets.const';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
    private hubConnections: { [ hubname: string ] : HubConnection } = {}

    constructor(
      private storageHelper : StorageService,
      private serverConfig: ServerConfigService
    ) { }

    public start(hubName: string) : Observable<void>{
      if(!Object.hasOwn(HUBS, hubName) && this.hubConnections[hubName] !== undefined && this.hubConnections[hubName].state == HubConnectionState.Connected){
        return new Observable<void>();
      }

      this.hubConnections[hubName] = new HubConnectionBuilder()
        .withUrl(`${this.serverConfig.serverHub}${hubName}`, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
          accessTokenFactory: async () => { return this.storageHelper.getToken()},
        })
        .withHubProtocol(new MessagePackHubProtocol())
        .build();

        const connection = this.hubConnections[hubName].start();
        return from(connection);
    }

    // eslint-disable-next-line
    public on(hubName: string, event: string, callback: (...args: any[]) => void){
      this.hubConnections[hubName].on(event,callback);
    }

    // eslint-disable-next-line
    public invoke<T>(hubName: string, event: string, data?: T){
      this.hubConnections[hubName].invoke(event);
    }

    public closeAllConnections(){
      for (const key in this.hubConnections) {
        this.hubConnections[key].stop();
      }
      this.hubConnections = {};
    }
}
