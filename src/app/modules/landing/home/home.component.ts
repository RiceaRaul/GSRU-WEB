import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { TranslocoModule } from '@ngneat/transloco';
import { User } from 'app/_core/models/user.types';
import { UserService } from 'app/_core/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import {MatBadgeModule} from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthUtils } from 'app/_core/helpers/auth.utils';
import { MatTabsModule } from '@angular/material/tabs';
import { Employee } from 'app/_core/models/employee.types';
import { TeamOverviewComponent } from 'app/layout/common/team-overview/team-overview.component';
import { BacklogOverviewComponent } from 'app/layout/common/backlog-overview/backlog-overview.component';
import { CurrentSprintComponent } from 'app/layout/common/current-sprint/current-sprint.component';
import { OverviewTabComponent } from 'app/layout/common/overview-tab/overview-tab.component';


@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [TranslocoModule,MatButtonModule, RouterLink, MatIconModule, NgIf, NgFor, FuseCardComponent, MatBadgeModule, MatMenuModule, MatTabsModule, JsonPipe, TeamOverviewComponent, BacklogOverviewComponent, CurrentSprintComponent, OverviewTabComponent],
})
export class LandingHomeComponent implements OnInit,OnDestroy
{
    user: User;
    userData: Employee;
    teams: string[]
    selectedTeam: string;
    selectedTeamId: number;
    notifications:string[] = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef
    )
    {
    }

    ngOnInit(): void {
        this.selectedTeam = this.route.snapshot.params.team;
        this.subscribe(this.selectedTeam);
    }

    subscribe(selectedTeam){
        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: User) =>
        {
            this.user = user;
            this.teams = AuthUtils.getTeams(this.user.token);
            this.changeDetectorRef.markForCheck();
        });

        this._userService.userData$.pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: Employee) =>
        {
            this.userData = user;
            this.selectedTeamId = this.userData?.teams.find(team => team.name === selectedTeam)?.id;
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
