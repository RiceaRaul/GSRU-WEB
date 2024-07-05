import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Urls } from 'app/_core/constants/urls.const';
import { AuthUtils } from 'app/_core/helpers/auth.utils';
import { User } from 'app/_core/models/user.types';
import { FirstLetterPipe } from 'app/_core/pipes/first-letter.pipe';
import { StorageService } from 'app/_core/services/storage.service';
import { UserService } from 'app/_core/services/user.service';

@Component({
    selector: 'app-multi-team-select',
    standalone: true,
    imports: [
        CommonModule, FirstLetterPipe
    ],
    templateUrl: './multi-team-select.component.html',
    styleUrl: './multi-team-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiTeamSelectComponent implements OnInit{


    user: User;
    teams: string[]
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaW9uLnJpY2VhQHJpY2VhcmF1bC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9oYXNoIjoiWHA3c2tYdTk1MFk3b2RRVDNCS0VCREk9IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiSFIiLCJUZWFtcyI6WyJUZXN0IDEiLCJUZXN0IDIiXSwibmJmIjoxNzE2MzI1Mzg3LCJleHAiOjE3MTYzMjY1ODcsImlzcyI6IkdzcnUtQXBpIiwiYXVkIjoiR3NydS1BcGkifQ.QM4UsKQ0yMlIW7Uttq2N7ZC2yPZiswEAvq80qiCJNw8'
    constructor(
        private userService: UserService,
        private changeDetectorRef: ChangeDetectorRef,
        private storageHelper: StorageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userSubscribe();
        this.teams = AuthUtils.getTeams(this.token);
        this.changeDetectorRef.detectChanges();
    } 

    userSubscribe(){
        this.userService.user$.subscribe((user) => {
            this.user = user;
            this.teams = AuthUtils.getTeams(this.token);
            this.changeDetectorRef.detectChanges();
        });
    }

    selectTeam($event: MouseEvent ,team: string) {
        this.storageHelper.setSelectedTeam(team);
        this.router.navigate([Urls.HOME, team]);
    }

}
