import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/_core/api/auth.service';
import { of, switchMap } from 'rxjs';
import { Urls } from '../constants/urls.const';

export const AuthGuard: CanActivateFn | CanActivateChildFn = () =>
{
    const router: Router = inject(Router);
    const authService = inject(AuthService);
    return authService.check().pipe(
        switchMap((authenticated) =>
        {
            if ( !authenticated )
            {
                authService.signInWithToken().subscribe({
                    next:((response) =>{
                        if(response == null){
                            router.navigate([Urls.SIGN_IN]);
                        }
                        return of(true);
                    }),
                    error:(()=>{
                        router.navigate([Urls.ERRORS, Urls.ACCESS_DENIED]);
                    })
                });
            }

            // Allow the access
            return of(true);
        }),
    );
};
