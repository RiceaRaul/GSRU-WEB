import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/_core/helpers/auth.utils';
import { UserService } from 'app/_core/services/user.service';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { LoginRequest, User } from '../models/user.types';
import { Route, Router } from '@angular/router';
import { Urls } from '../constants/urls.const';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({providedIn: 'root'})
export class AuthService
{
    private readonly authUrl = 'Authenticate';

    private _authenticated: boolean = false;

    constructor(
        private _userService: UserService,
        private apiService:ApiService,
        private storageHelper: StorageService,
        private _router:Router
    ) { }

    set accessToken(token: string)
    {
        this.storageHelper.saveToken(token);
    }

    get accessToken(): string
    {
        return this.storageHelper.getToken() ?? '';
    }

    
    set refreshToken(token: string)
    {
        this.storageHelper.saveRefreshToken(token);
    }

    get refreshToken(): string
    {
        return this.storageHelper.getRefreshToken() ?? '';
    }


    signIn(body: LoginRequest): Observable<any>
    {
        if ( this._authenticated )
        {
            return throwError(() => new Error('User is already logged in.'));
        }

        return this.apiService.post(`${this.authUrl}/login`, body).pipe(
            switchMap(response => this.mapUserResponse(response)),
        );
    }

    signInWithToken(): Observable<any>{
        const rememberMe = this.storageHelper.getRememberMe();
        const refreshToken = this.storageHelper.getRefreshToken();

        if(!rememberMe && !refreshToken){
            return of(null);
        }
        
        if ( this._authenticated )
        {
            return of(null);
        }

        return this.apiService.post(`${this.authUrl}/login-using-token`).pipe(
            switchMap(response =>  this.mapUserResponse(response)),
            map((response) => {
                return response;
            }),
            catchError((error) => {
                this._router.navigate([Urls.SIGN_IN])
                return throwError(() => new Error('User is not logged in.'));
            })
        );
    }

    check(): Observable<boolean>
    {
        if ( !this.accessToken )
        {
            return of(false);
        }

        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            console.log('Token expired');
            return of(false);
        }
        if ( this._authenticated )
        {
            console.log('User is already logged in.');

            return of(true);
        }

        return of(false);
    }

    private mapUserResponse(response: any): Observable<any> 
    {
        this.accessToken = response.token;
        this.refreshToken = response.refreshToken;

        const mappedUser: User = {
            username: response.username ?? '',
            token: response.token ?? '',
            expiresIn: response.expiresIn ?? 0,
            refreshToken: response.refreshToken ?? '',
            refreshExpiresIn: response.refreshExpiresIn ?? 0,
            tokenType: response.tokenType ?? '',
            avatar: response.avatar ?? ''
        }

        this._userService.user = mappedUser;

        this._authenticated = true;
        return of(response);
    }

    signOut(): void{
        this.storageHelper.deleteToken();
        this.storageHelper.deleteRefreshToken();
        this._authenticated = false;
        this._userService.user = null;
        this._router.navigate([Urls.SIGN_IN]);
    }
}
