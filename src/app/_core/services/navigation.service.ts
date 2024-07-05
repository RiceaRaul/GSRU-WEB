import { Injectable } from '@angular/core';
import { Navigation } from 'app/_core/models/navigation.types';
import { Observable, ReplaySubject, of } from 'rxjs';
import { NAVIGATION_LIST } from '../constants/navigation.const';
import { TranslocoService } from '@ngneat/transloco';
import { LanguageSection } from '../constants/language-sections.const';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthUtils } from '../helpers/auth.utils';
import { AuthService } from '../api/auth.service';

@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    /**
     * Constructor
     */
    constructor(
        private translateService: TranslocoService,
        private authService: AuthService
    )
    {
        this.subscribeLanguageChange();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    /* eslint-disable @typescript-eslint/no-explicit-any */

    private getTranslation(language?:string) : Observable<any>{
        return this.translateService.selectTranslateObject(LanguageSection.SIDE_BAR,null,language);
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    private subscribeLanguageChange(){
        this.translateService.langChanges$.subscribe((activeLanguage:string)=>{
            this.getTranslation(activeLanguage).subscribe(() => {
                this.get();
            });
        })
    }

    private translateNavigation(): FuseNavigationItem[] {
        let roles = AuthUtils.getRoles(this.authService.accessToken);

        let navigation = NAVIGATION_LIST.filter(item => item.meta.roles.length === 0 || item.meta.roles.some(role => roles.includes(role)));

        return navigation.map(item => ({
            ...item,
            title: this.translateService.translate(item.title),
            children: item.children?.map(child => ({
                ...child,
                title: this.translateService.translate(child.title)
            }))
        }));
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        const translatedNavigation = this.translateNavigation();
        const nav: Navigation={
            default:translatedNavigation,
            compact:translatedNavigation,
            futuristic:translatedNavigation,
            horizontal:translatedNavigation
        }
        this._navigation.next(nav)

        return of(nav);
    }
}
