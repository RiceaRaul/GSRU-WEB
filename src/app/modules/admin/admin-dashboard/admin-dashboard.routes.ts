import { Routes } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { AdminDashboardComponent } from './admin-dashboard.component';

export default [
    {
        path     : '',
        component: AdminDashboardComponent,
    },
] as Routes;
