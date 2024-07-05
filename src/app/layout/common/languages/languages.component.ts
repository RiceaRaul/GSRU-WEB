import { NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { User } from 'app/_core/models/user.types';
import { UserService } from 'app/_core/services/user.service';
import { Subject, take, takeUntil } from 'rxjs';


/* eslint-disable @typescript-eslint/no-explicit-any */

@Component({
    selector       : 'languages',
    templateUrl    : './languages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'languages',
    standalone     : true,
    imports        : [MatButtonModule, MatMenuModule, NgTemplateOutlet, NgFor],
})
export class LanguagesComponent implements OnInit, OnDestroy
{
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;
    user:User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _translocoService: TranslocoService,
        private _userService: UserService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the available languages from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) =>
        {
            // Get the active lang
            this.activeLang = activeLang;

            // Update the navigation
            this._updateNavigation();
        });

        // Set the country iso codes for languages for flags
        this.flagCodes = {
            'ro': 'ro',
            'en': 'en'
        };

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.user = user;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void
    {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() =>
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(): void
    {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');

        // Return if the navigation component does not exist
        if ( !navComponent )
        {
            return null;
        }

        // Get the flat navigation data
        const navigation = navComponent.navigation;

        // Get the Project dashboard item and update its title
        const projectDashboardItem = this._fuseNavigationService.getItem('dashboards.project', navigation);
        if ( projectDashboardItem )
        {
            this._translocoService.selectTranslate('Project').pipe(take(1))
                .subscribe((translation) =>
                {
                    // Set the title
                    projectDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        // Get the Analytics dashboard item and update its title
        const analyticsDashboardItem = this._fuseNavigationService.getItem('dashboards.analytics', navigation);
        if ( analyticsDashboardItem )
        {
            this._translocoService.selectTranslate('Analytics').pipe(take(1))
                .subscribe((translation) =>
                {
                    // Set the title
                    analyticsDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
    }
}
