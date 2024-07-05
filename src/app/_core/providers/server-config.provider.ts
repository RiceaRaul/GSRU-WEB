import { APP_INITIALIZER, EnvironmentProviders, Provider } from '@angular/core';
import { ServerConfigService } from '../services/server-config.service';


export const provideServerConfig = (): Array<Provider | EnvironmentProviders> =>
{
    return [
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [ServerConfigService],
            useFactory: (serverConfigService: ServerConfigService) => {
                return () => {
                return serverConfigService.loadServerConfig();
                };
            }
        },
    ];
};
