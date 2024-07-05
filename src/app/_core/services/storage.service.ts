import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  //token key for cookie
  private readonly tokenKey: string = 'accessToken';
  private readonly refreshTokenKey: string = 'refreshAccessToken';
  private readonly remembermeKey: string = 'rememberme';
  private readonly selectedTeam: string = 'selectedTeam';
  //theme key for cookie in order to remember the theme you set after webpage closed
  private readonly themeKey: string = 'isDarkTheme';

  constructor(private cookieService: CookieService) { }

  saveToken(token: string) {
    this.cookieService.set(`${this.tokenKey}`, token, null, '/', null,true);
  }

  deleteToken(){
    this.cookieService.delete(`${this.tokenKey}`);
  }

  getToken() {
    return this.cookieService.get(`${this.tokenKey}`);
  }

  saveRefreshToken(token: string) {
    this.cookieService.set(this.refreshTokenKey, token, null, '/', null,true);
  }

  deleteRefreshToken(){
    this.cookieService.delete(this.refreshTokenKey);
  }

  getRefreshToken() {
    return this.cookieService.get(this.refreshTokenKey);
  }

  setTheme(isDarkTheme: boolean){
    this.cookieService.set(`${this.themeKey}`, `${isDarkTheme}`, null, '/', null,true);
  }

  getTheme(){
    return this.cookieService.get(`${this.themeKey}`);
  }

  setRememberMe(rememberme: boolean){
    this.cookieService.set(`${this.remembermeKey}`, `${rememberme}`, null, '/', null,true);
  }

  getRememberMe(){
    return this.cookieService.get(`${this.remembermeKey}`);
  }

  setSelectedTeam(team: string){
    this.cookieService.set(`${this.selectedTeam}`, team, null, '/', null,true);
  }

  getSelectedTeam(){
    return this.cookieService.get(`${this.selectedTeam}`);
  }
}
