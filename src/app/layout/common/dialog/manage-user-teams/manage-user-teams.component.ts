import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeService } from 'app/_core/api/employee.service';
import { TeamService } from 'app/_core/api/team.service';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { Employee } from 'app/_core/models/employee.types';
import { Role } from 'app/_core/models/roles.types';
import { Team } from 'app/_core/models/teams.types';
import { DialogService } from 'app/_core/services/dialog.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-manage-user-teams',
    standalone: true,
    imports: [
        CommonModule, MatSelectModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule, MatTabsModule
    ],
    templateUrl: './manage-user-teams.component.html',
    styleUrl: './manage-user-teams.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUserTeamsComponent implements OnInit{

    teams: Team[] = [];
    roles: Role[] = [];
    selectedTeam: number;
    employee:Employee;

    selectedRole: number;
    constructor(
        private dialogService: DialogService,
        private employeeServe:EmployeeService,
        private teamsService:TeamService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.employee = this.dialogService.params.employee;
    }

    ngOnInit(): void {
        this.teamsService.getTeams().subscribe({
            next: (teams: Team[]) => {
                this.teams = teams.filter(team => !this.employee.teams.some(x=>x.id === team.id));
            },
            error: () => {
                Swal.fire('Error', 'An error occured while fetching teams', 'error');
            }
        });

        this.employeeServe.getRoles().subscribe({
            next: (roles:GenericReponse<Role[]>) => {
                this.roles = roles.data.filter(role => !this.employee.roles.some(x=>x === role.name) && role.name !== "User");
            },
            error: () => {
                Swal.fire('Error', 'An error occured while fetching roles', 'error');
            }
        });

        this.employee.roles = this.employee.roles.filter(x =>x !=="User");
    }

    addTeam() {
        if(!this.selectedTeam) {
            Swal.fire('No team selected', 'Please select a team to add', 'warning');
            return;
        }

        this.employeeServe.addTeamToEmployee(this.employee.id, this.selectedTeam).subscribe({
            next: () => {
                Swal.fire('Team added', 'Team has been added successfully', 'success');
                this.employee.teams.push(this.teams.find(x => x.id === this.selectedTeam));
                this.changeDetectorRef.detectChanges();
            },
            error: () => {
                Swal.fire('Error', 'An error occured while adding the team', 'error');
            }
        });
    }

    addRole(){
        if(!this.selectedRole) {
            Swal.fire('No role selected', 'Please select a role to add', 'warning');
            return;
        }

        this.employeeServe.addEmployeeRole(this.employee.id, this.selectedRole).subscribe({
            next: () => {
                Swal.fire('Role added', 'Role has been added successfully', 'success');
                this.employee.roles.push(this.roles.find(x=>x.id == this.selectedRole).name);
                this.changeDetectorRef.detectChanges();
            },
            error: () => {
                Swal.fire('Error', 'An error occured while adding the role', 'error');
            }
        });
    }

    removeRole(role:string){
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this role from the employee?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.employeeServe.removeEmployeeRole(this.employee.id, role).subscribe({
                    next: () => {
                        Swal.fire('Role removed', 'Role has been removed successfully', 'success');
                        this.employee.roles = this.employee.roles.filter(x => x !== role);
                        this.changeDetectorRef.detectChanges();
                    },
                    error: () => {
                        Swal.fire('Error', 'An error occured while removing the role', 'error');
                    }
                });
            }
        });
    }

    removeTeam(teamId: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this team from the employee?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.employeeServe.removeEmployeeFromTeam(this.employee.id, teamId).subscribe({
                    next: () => {
                        Swal.fire('Team removed', 'Team has been removed successfully', 'success');
                        this.employee.teams = this.employee.teams.filter(x => x.id !== teamId);
                        this.changeDetectorRef.detectChanges();
                    },
                    error: () => {
                        Swal.fire('Error', 'An error occured while removing the team', 'error');
                    }
                });
            }
        });
    }

}
