import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TeamService } from 'app/_core/api/team.service';
import { AuthUtils } from 'app/_core/helpers/auth.utils';
import Utils from 'app/_core/helpers/utils';
import { TeamMemberOverview } from 'app/_core/models/teams.types';
import { User } from 'app/_core/models/user.types';
import { FirstLetterPipe } from 'app/_core/pipes/first-letter.pipe';
import { ToastService } from 'app/_core/services/toast.service';
import { UserService } from 'app/_core/services/user.service';

@Component({
    selector: 'app-team-overview',
    standalone: true,
    imports: [
        CommonModule,FirstLetterPipe, MatIconModule, MatButtonModule, MatTooltipModule
    ],
    templateUrl: './team-overview.component.html',
    styleUrl: './team-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamOverviewComponent implements OnInit{
    private _teamId: number = 0;
    @Input() set teamId(value: number) {
        this._teamId = value;
        this.getMembers();
    };

    get teamId(): number {
        return this._teamId;
    }
    user:User;
    members: TeamMemberOverview | null = null;
    constructor(
        private teamService: TeamService,
        private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef,
        private router:Router,
        private userService: UserService
    ) { }
    
    ngOnInit(): void {
        this.getMembers();
        this.userService.user$.subscribe((data:User) => {
            this.user = data;
        });
    }

    isTeamLead(){
        return Utils.isTeamLead(this.user.token)
    }


    private getMembers() {
        this.teamService.getMemberOverView(this._teamId).subscribe({
            next: (members: TeamMemberOverview) => {
                this.members = members;
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                this.toastService.showErrorMessage(error);
            }
        });
    }

    navigate(id){
        this.router.navigate(['/calendar'], {queryParams:{id:id}});
    }
}
