import { Route, RouterModule } from '@angular/router';
import { initialAuthResolver, initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/_core/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { NgModule } from '@angular/core';
import { Urls } from './_core/constants/urls.const';
import { NoAuthGuard } from './_core/guards/no-auth.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const routes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: `${Urls.HOME}/redirect`},

    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        resolve: {
            initialData: initialAuthResolver
        },
        children: [
            {path: Urls.SIGN_IN, loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
        ]
    },

    {
        path: '',
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        data: {
            layout: 'empty'
        },
        children: [
            {path: Urls.SELECT_TEAM, loadChildren: () => import('app/modules/auth/multi-team-select/multi-team-select.routes')},
        ]
    },

    
    {
        path: '',
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: Urls.HOME, loadChildren: () => import('app/modules/landing/home/home.routes')},
            {path: 'calendar', loadChildren: () => import('app/modules/landing/calendar/calendar.routes')},
            {path: Urls.HOLIDAYS, loadChildren: () => import('app/modules/landing/holidays/holidays.routes')},
        ]
    },

    {
        path: 'admin',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        data:{
            layout:'dense'
        },
        children: [
            {path: '', loadChildren: () => import('app/modules/admin/admin-dashboard/admin-dashboard.routes')},
        ]
    },

    {
        path: Urls.ERRORS, children: [
            {path: Urls.NOT_FOUND, loadChildren: () => import('app/modules/errors/error-page/not-found.router')},
            {path: Urls.ACCESS_DENIED, loadChildren: () => import('app/modules/errors/error-page/access-denied.router')}
        ]
    },

    {path: '**', redirectTo: `${Urls.ERRORS}/${Urls.NOT_FOUND}`}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
