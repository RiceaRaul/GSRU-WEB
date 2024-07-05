import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { BacklogService } from 'app/_core/api/backlog.service';
import {
    BoardConfiguration,
    BoardConfigurationResponse,
} from 'app/_core/models/board.types';
import { ChartOptions } from 'app/_core/models/chart.types';
import { Backlog, Sprint } from 'app/_core/models/sprint.types';
import { ToastService } from 'app/_core/services/toast.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-overview-tab',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './overview-tab.component.html',
    styleUrl: './overview-tab.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewTabComponent implements OnInit {
    private _teamId: number = 0;
    @Input() set teamId(value: number) {
        this._teamId = value;
        this.getBacklogTeam();
    }

    get teamId(): number {
        return this._teamId;
    }
    backlogData: Backlog;
    totalTasks: number;
    completedTasks: number;
    currentSprint: Sprint;
    boardConfiguration: BoardConfiguration[];

    public estimateVsRemaining: ChartOptions;
    public taskAssignees: ChartOptions;
    public taskTypesDistribution: ChartOptions;

    constructor(
        private backLogService: BacklogService,
        private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}
    ngOnInit(): void {
        this.getBacklogTeam();
    }

    private getBacklogTeam(team_id: number = null) {
        this.backLogService.getBacklog(this.teamId ?? team_id).subscribe({
            next: (data: Backlog) => {
                this.backlogData = data;
                this.prepareData();
            },
            error: (error) => {
                this.toastService.showErrorMessage(error);
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            },
        });

        this.backLogService
            .getBoardConfiguration(this.teamId ?? team_id)
            .subscribe({
                next: (data: BoardConfigurationResponse) => {
                    this.boardConfiguration = data.configuration;
                    this.backLogService
                        .getActiveSprint(this.teamId ?? team_id)
                        .subscribe({
                            next: (data: Sprint) => {
                                this.currentSprint = data;
                                this.prepareChartsCurrentSprint();
                                this.changeDetectorRef.detectChanges();
                            },
                            error: (error:HttpErrorResponse) => {
                                if(error.status === 404) {
                                    this.currentSprint = {id:-1,number:0, tasks: []}
                                    this.prepareChartsCurrentSprint();
                                    this.changeDetectorRef.detectChanges();
                                    return;
                                }
                                Swal.fire(
                                    'Error',
                                    'An error occured while fetching active sprint',
                                    'error'
                                );
                            },
                        });
                },
                error: () => {
                    Swal.fire(
                        'Error',
                        'An error occured while fetching board configuration',
                        'error'
                    );
                },
            });
    }

    prepareData() {
        this.totalTasks = this.backlogData.sprints.reduce((acc, story) => {
            const numTasks = story.tasks?.length ?? 0;

            const numChildrenTasks =
                story.tasks?.reduce((acc, task) => {
                    return acc + (task.children?.length ?? 0);
                }, 0) ?? 0;

            // Add the number of tasks and children tasks to the accumulator
            return acc + numTasks + numChildrenTasks;
        }, 0);

        this.completedTasks = this.backlogData.sprints.reduce((acc, story) => {
            return (
                acc +
                (story.tasks?.filter((task) => task.taskStatus === 'DONE')
                    .length ?? 0) +
                story.tasks.reduce((acc, task) => {
                    return (
                        acc +
                            task.children?.filter(
                                (task) => task.taskStatus === 'DONE'
                            ).length ?? 0
                    );
                }, 0)
            );
        }, 0);
    }

    prepareChartsCurrentSprint() {
        var tasks = this.currentSprint.tasks;
        // append tasks from children
        tasks.forEach((task) => {
            if (task.children) {
                tasks = tasks.concat(task.children);
            }
        });

        const taskNames = tasks.map((task) => task.name);
        const estimatedTimes = tasks.map((task) => task.estimateTime);
        const actualTimes = tasks.map(
            (task) => task.estimateTime - task.remainingTime
        );
        this.estimateVsRemaining = {
            series: [
                {
                    name: 'Estimated Time',
                    data: estimatedTimes,
                },
                {
                    name: 'Actual Time',
                    data: actualTimes,
                },
            ],
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: taskNames,
            },
            yaxis: {
                title: {
                    text: 'Time (hours)',
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return `${val} hours`;
                    },
                },
            },
            legend: {
                position: 'top',
            },
        };

        const assigneeCount = {};
        tasks.forEach((task) => {
            task.taskAssignees.forEach((assignee) => {
                if (assigneeCount[assignee.employeeName]) {
                    assigneeCount[assignee.employeeName]++;
                } else {
                    assigneeCount[assignee.employeeName] = 1;
                }
            });
        });

        const assigneeNames = Object.keys(assigneeCount);
        const taskCounts: number[] = Object.values(assigneeCount);
        this.taskAssignees = {
            series: [
                {
                    name: 'Tasks Assigned',
                    data: taskCounts,
                },
            ],
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: assigneeNames,
            },
            yaxis: {
                title: {
                    text: 'Number of Tasks',
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return `${val} tasks`;
                    },
                },
            },
            legend: {
                position: 'top',
            },
        };

        var tasksByType = tasks.reduce((acc, task) => {
            acc[task.taskType] = (acc[task.taskType] || 0) + 1;
            return acc;
        }, {});

        const taskTypes = Object.keys(tasksByType);
        const taskCountsByType:any[] = Object.values(tasksByType);

        this.taskTypesDistribution = {
            series: taskCountsByType,
            chart: {
                type: 'pie',
                height: 350,
            },
            labels: taskTypes,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };
    }
}
