import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/_core/api/auth.service';
import { of, switchMap } from 'rxjs';
import { Urls } from '../constants/urls.const';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = () =>
{
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).check().pipe(
        switchMap((authenticated) =>
        {
            // If the user is authenticated...
            if ( authenticated )
            {
                return of(router.parseUrl(Urls.HOME));
            }

            // Allow the access
            return of(true);
        }),
    );
};
