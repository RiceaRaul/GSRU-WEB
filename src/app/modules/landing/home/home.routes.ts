import { Routes } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { HomeRedirectComponent } from './home-redirect/home-redirect.component';

export default [
    {
        path     : '',
        exact    : true,
        component: HomeRedirectComponent,
    },
    {
        path     : 'redirect',
        exact    : true,
        component: HomeRedirectComponent,
    },
    {
        path     : ':team',
        component: LandingHomeComponent,
    }
] as Routes;
