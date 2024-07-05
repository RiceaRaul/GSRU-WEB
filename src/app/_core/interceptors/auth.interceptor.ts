import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthUtils } from 'app/_core/helpers/auth.utils';
import { catchError, Observable, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{
    const storageHelper = inject(StorageService);
    let newReq = req.clone();
    const refreshAccessToken = storageHelper.getRefreshToken();
    const token = storageHelper.getToken();
    if(refreshAccessToken && !AuthUtils.isTokenExpired(refreshAccessToken) && req.url.indexOf('/login-using-token') != -1){
        newReq = req.clone({
            withCredentials:true,
            headers: req.headers
                .set('Authorization', `Bearer ${refreshAccessToken}`)
        });
    }

    else if ( token && !AuthUtils.isTokenExpired(token) && req.url.indexOf('Authenticate/login') == -1 )
    {
        newReq = req.clone({
            withCredentials:true,
            headers: req.headers
                .set('Authorization', 'Bearer ' + storageHelper.getToken())
        });
    }
    else
    {
        newReq = req.clone({withCredentials: true});
    }

    // Response
    return next(newReq).pipe(
        catchError((error) =>
        {
            if ( error instanceof HttpErrorResponse && error.status === 401 && (req.url.indexOf('Authenticate/login') == -1 || req.url.indexOf('login-using-token') == -1) )
            {
                // Sign out
                //authService.signOut();

                // Reload the app
               // location.reload();
            }
            return throwError(() => new HttpErrorResponse(error));
        }),
    );
};
