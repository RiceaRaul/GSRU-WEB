import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { Employee } from 'app/_core/models/employee.types';
import { User } from 'app/_core/models/user.types';
import { UserService } from 'app/_core/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user',
    standalone     : true,
    imports        : [MatButtonModule, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule, TranslocoModule],
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    userData: Employee;

    // eslint-disable-next-line
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
    )
    {
    }

    ngOnInit(): void
    {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this._userService.userData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: Employee) =>
            {
                this.userData = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
        });
    }


    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }
}
