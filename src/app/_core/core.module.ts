import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateAdapter } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';

import { provideIcons } from 'app/_core/providers/icons.provider';
import { provideTransloco } from 'app/_core/providers/transloco.provider';
import { provideFuse } from '@fuse';
import { provideMatDateFormats } from './providers/mat-date-formats.provider';
import { mockApiServices } from 'app/mock-api';
import { provideAuth } from './providers/auth.provider';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServerConfig } from './providers/server-config.provider';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers:[
        provideServerConfig(),
        //Fuse
        provideAnimations(),
        provideHttpClient(),
        {
            provide : DateAdapter,
            useClass: LuxonDateAdapter,
        },
        provideMatDateFormats(),
        provideTransloco(),
        provideAuth(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay   : 0,
                services: mockApiServices,
            },
            fuse   : {
                layout : 'enterprise',
                scheme : 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme  : 'theme-purple',
                themes : [
                    {
                        id  : 'theme-default',
                        name: 'Default',
                    },
                    {
                        id  : 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id  : 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id  : 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id  : 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id  : 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),
    ]
})
export class CoreModule { }
