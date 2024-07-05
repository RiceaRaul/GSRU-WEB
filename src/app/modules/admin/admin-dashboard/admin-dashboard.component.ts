import { CommonModule, DecimalPipe, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FuseCardComponent } from '@fuse/components/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { analytics as analyticsData } from 'app/mock-api/dashboards/analytics/data';
import { cloneDeep } from 'lodash';
import { Employee } from 'app/_core/models/employee.types';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TitlecasePipe } from 'app/_core/pipes/titlecase.pipe';
import { first } from 'igniteui-angular/lib/core/utils';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EmployeeService } from 'app/_core/api/employee.service';
import Swal from 'sweetalert2';
import { DialogService } from 'app/_core/services/dialog.service';
import { Modals } from 'app/_core/constants/modals.const';
import { UpdateEmployeeComponent } from 'app/layout/common/dialog/update-employee/update-employee.component';
import { AddEmployeeComponent } from 'app/layout/common/dialog/add-employee/add-employee.component';
import { ManageUserTeamsComponent } from 'app/layout/common/dialog/manage-user-teams/manage-user-teams.component';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { em } from '@fullcalendar/core/internal-common';
import { Team } from 'app/_core/models/teams.types';
import { TeamService } from 'app/_core/api/team.service';
import { UpsertTeamComponent } from 'app/layout/common/dialog/upsert-team/upsert-team.component';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule,MatTooltipModule, NgFor, DecimalPipe, MatTableModule, TitlecasePipe, MatSortModule, MatPaginatorModule
    ],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit, AfterViewInit{

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('EmployeePaginator') employeePaginator: MatPaginator;
    @ViewChild('TeamsPaginator') teamsPaginator: MatPaginator;

    chartVisitors: ApexOptions;
    data:any = {
        employees: {
            series: {
                'this-year':[
                    {
                        name:"This Year",
                        data:[]
                    }
                ],
                'last-year':[
                    {
                        name:"Last Year",
                        data:[]
                    }
                ]
            }
        }
    };
    constructor(
        private _router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private employeeService: EmployeeService,
        private dialogService: DialogService,
        private teamService: TeamService
    ) {
    }

    employeesDataSource = new MatTableDataSource();
    employees:Employee[] = []
    employeesColumns = ['firstName', 'lastName', 'workHours', 'phoneNumber', 'email', 'actions']
    columnsType = {
        firstName: 'text',
        lastName: 'text',
        workHours: 'number',
        phoneNumber: 'text',
        email: 'text'
    }

    teams:Team[] = []
    teamsDataSource = new MatTableDataSource();
    teamsColumns = ['name', 'actions']
    teamsColumnType = {
        name: 'text'
    }

    ngOnInit(): void {
        //this.data = cloneDeep(analyticsData)
        var date = new Date();
        this.employeeService.getEmployeeHireData(date.getFullYear()).subscribe({
            next: (data:GenericReponse<any[]>) => {
                this.data.employees.series['this-year'] = [{
                    name: 'This Year',
                    data:  data.data
                }];

                this.changeDetectorRef.detectChanges();
            }
        });
        this.employeeService.getEmployeeHireData(date.getFullYear() - 1).subscribe({
            next: (data:GenericReponse<any[]>) => {
                this.data.employees.series['last-year'] = [{
                    name: 'Last Year',
                    data:  data.data
                }];

                this.changeDetectorRef.detectChanges();
            }
        });
        this._preapareCharts();
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
        this.employeeService.getEmployees().subscribe({
            next: (employees:Employee[]) => {
                this.employees = employees;
                this.employeesDataSource = new MatTableDataSource(this.employees);
                this.employeesDataSource.sort = this.sort;
                this.employeesDataSource.paginator = this.employeePaginator;
                this.changeDetectorRef.detectChanges();
            }
        });

        this.teamService.getTeams().subscribe({
            next: (teams:Team[]) => {
                this.teams = teams;
                this.teamsDataSource = new MatTableDataSource(this.teams);
                this.teamsDataSource.paginator = this.teamsPaginator;
                this.changeDetectorRef.detectChanges();
            }
        });
    } 


    ngAfterViewInit() {
        this.employeesDataSource.paginator = this.employeePaginator;
        this.changeDetectorRef.detectChanges();
    }

    private _preapareCharts(){
        this.chartVisitors = {
            chart     : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                width     : '100%',
                height    : '100%',
                type      : 'area',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            colors    : ['#818CF8'],
            dataLabels: {
                enabled: false,
            },
            fill      : {
                colors: ['#312E81'],
            },
            grid      : {
                show       : true,
                borderColor: '#334155',
                padding    : {
                    top   : 10,
                    bottom: -40,
                    left  : 0,
                    right : 0,
                },
                position   : 'back',
                xaxis      : {
                    lines: {
                        show: true,
                    },
                },
            },
            series    : this.data.employees.series,
            stroke    : {
                width: 2,
            },
            tooltip   : {
                followCursor: true,
                theme       : 'dark',
                x           : {
                    format: 'MMM dd, yyyy',
                },
                y           : {
                    formatter: (value: number): string => `${value}`,
                },
            },
            xaxis     : {
                axisBorder: {
                    show: false,
                },
                axisTicks : {
                    show: false,
                },
                crosshairs: {
                    stroke: {
                        color    : '#475569',
                        dashArray: 0,
                        width    : 2,
                    },
                },
                labels    : {
                    offsetY: -20,
                    style  : {
                        colors: '#CBD5E1',
                    },
                },
                tickAmount: 20,
                tooltip   : {
                    enabled: false,
                },
                type      : 'datetime',
            },
            yaxis     : {
                axisTicks : {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                min       : (min): number => min - 750,
                max       : (max): number => max + 250,
                tickAmount: 5,
                show      : false,
            },
        };
    }

    addEmployee(){
        this.dialogService.openModal(Modals.ADD_EMPLOYEE_DIALOG, {}, AddEmployeeComponent)
    }

    onEdit(Employee: Employee){
        this.dialogService.openModal(Modals.UPDATE_EMPLOYEE_DIALOG, {employee: Employee}, UpdateEmployeeComponent)
    }

    empTeamEdit(Employee: Employee){
        this.dialogService.openModal(Modals.MANAGE_EMP_TEAMS_DIALOG, {employee: Employee}, ManageUserTeamsComponent)
    }

    onDelete(Employee: Employee){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
            this.employeeService.fireEmployee(Employee.id).subscribe({
                next: () => {
                    this.employees = this.employees.filter(e => e.id !== Employee.id);
                    this.employeesDataSource = new MatTableDataSource(this.employees);
                    this.changeDetectorRef.detectChanges();
                    Swal.fire({
                        title: "Dismissal!",
                        text: "Employee has been dismissed.",
                        icon: "success"
                    });
                },
                error: (error) => {
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred while dismissing employee.",
                        icon: "error"
                    });
                }
            });
            }
        });
    }

    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) =>
            {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    addTeam(){
        this.dialogService.openModal(Modals.ADD_TEAM_DIALOG, {}, UpsertTeamComponent)
    }

    editTeam(team: Team){
        this.dialogService.openModal(Modals.ADD_TEAM_DIALOG, {teamId: team.id, teamName:team.name, teamLeadId: team.teamLeadId }, UpsertTeamComponent)
    }

}