import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {  EnvironmentProviders, Provider } from '@angular/core';
import { authInterceptor } from 'app/_core/interceptors/auth.interceptor';

export const provideAuth = (): Array<Provider | EnvironmentProviders> =>
{
    return [
        provideHttpClient(withInterceptors([authInterceptor])),
    ];
};
