import { inject } from '@angular/core';
import { NavigationService } from 'app/_core/services/navigation.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { catchError, forkJoin, map } from 'rxjs';
import { AuthService } from './_core/api/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './_core/services/toast.service';

export const initialDataResolver = () =>
{
    const navigationService = inject(NavigationService);
    const notificationsService = inject(NotificationsService);
    const authService = inject(AuthService);

    return forkJoin([
        authService.signInWithToken(),
        navigationService.get(),
        notificationsService.getAll()
    ]);
};


export const initialAuthResolver = () =>
{
    const authService = inject(AuthService);
    const toastService = inject(ToastService);

    return authService.signInWithToken();
}