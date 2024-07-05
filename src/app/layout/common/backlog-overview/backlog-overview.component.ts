import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { Backlog } from 'app/_core/models/sprint.types';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Task } from 'app/_core/models/task.types';
import { MatBadgeModule } from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BacklogService } from 'app/_core/api/backlog.service';
import { ToastService } from 'app/_core/services/toast.service';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { DialogService } from 'app/_core/services/dialog.service';
import { Modals } from 'app/_core/constants/modals.const';
import { CreateTaskDialogComponent } from '../dialog/create-task-dialog/create-task-dialog.component';
import { StartSprintDialogComponent } from '../dialog/start-sprint-dialog/start-sprint-dialog.component';
import { WorkloadDialogComponent } from '../dialog/workload-dialog/workload-dialog.component';
import { WorkloadService } from 'app/_core/api/workload.service';
import { WorkloadData } from 'app/_core/models/workload.types';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    selector: 'app-backlog-overview',
    standalone: true,
    imports: [
        CommonModule, MatButtonModule, MatIconModule, MatExpansionModule, DragDropModule, MatBadgeModule, MatChipsModule, MatTooltipModule, TranslocoModule
    ],
    templateUrl: './backlog-overview.component.html',
    styleUrl: './backlog-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BacklogOverviewComponent implements OnInit{
    private _teamId: number = 0;
    panelOpenState = false;
    backlogData: Backlog | null = null;

    connectedDropLists = []
    selectedTasks: any[] = [];
    ctrlPressed = false;
    @Input() set teamId(value: number) {
        this._teamId = value;
        this.getBacklogTeam(value);
    };

    get teamId(): number {
        return this._teamId;
    }

    constructor(
        private backLogService: BacklogService,
        private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef,
        private dialogService: DialogService,
        private workloadService: WorkloadService
    ) {}

    ngOnInit(): void {}

    private getBacklogTeam(team_id: number = null) {
        this.backLogService.getBacklog(this.teamId ?? team_id).subscribe({
            next: (data: Backlog) => {
                this.backlogData = data;
            },
            error: (error) => {
                this.toastService.showErrorMessage(error);
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    openSprintWorkload(id: number, started: boolean){
        this.workloadService.getWorkloadBySprintId(id).subscribe({
            next: (data: WorkloadData) => {
                this.dialogService.openModal(Modals.WORKLOG_DIALOG, {
                    sprintId: id,
                    data: data,
                    started: started
                }, WorkloadDialogComponent);
            },
            error: (error) => { console.log(error); } 
        });
    }

    drop(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            if(this.selectedTasks.length > 0){
                for (let i = 0; i < this.selectedTasks.length; i++) {
                    var index = event.previousContainer.data.indexOf(this.selectedTasks[i]);
                    transferArrayItem(
                        event.previousContainer.data,
                        event.container.data,
                        index,
                        event.currentIndex + i,
                    );
                }
                this.selectedTasks = [];
            }
            else{
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex,
                );
            }
        }
        this.setIndexTasks(event.container.data);
        this.setIndexTasks(event.previousContainer.data);
        this.setTaskSprint(this.backlogData);
        this.updateBacklog();
    }

    updateBacklog(){
        var payload = _.flatMap(this.backlogData.sprints, sprint =>
            _.map(sprint.tasks, task => ({
                taskId: task.id,
                sprintId: sprint.id,
                index: task.index
            }))
        );
        this.backLogService.updateBacklog({tasks:payload}).subscribe({
            next: (data) => {
                //this.toastService.showSuccessMessage('Backlog updated successfully');
            },
            error: (error) => {
                this.toastService.showErrorMessage(error);
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    setIndexTasks(tasks: Task[]) {
        for (let i = 0; i < tasks.length; i++) {
            tasks[i].index = i + 1;
        }
    }

    setTaskSprint(backlog: Backlog) {
        for(let i = 0; i< backlog.sprints.length; i++){
            for(let j = 0; j< backlog.sprints[i].tasks.length; j++){
                backlog.sprints[i].tasks[j].sprintId = backlog.sprints[i].id;
            }
        }
    }

    toggleSelection(task: any, event: MouseEvent) {
        if (!this.ctrlPressed) {
            return;
        }

        const index = this.selectedTasks.indexOf(task);
        if (index > -1) {
            this.selectedTasks.splice(index, 1);
        } else {
            this.selectedTasks.push(task);
        }
    }

    trackByTaskId(index: number, task: any): number {
        return task.id;
    }

    addId(i: number) {
        const id = `cdk-drop-list-${i-1}`;
        this.connectedDropLists.push(id);
        return id;
    }

    isSelected(task: any): boolean {
        return this.selectedTasks.includes(task);
    }

    taskIcon(task: Task){
        switch (task.taskType) {
            case 'Task':
                return 'heroicons_solid:clipboard-document-check';
            case 'Bug':
                return 'heroicons_solid:exclamation-circle';
            case 'Story':
                return 'heroicons_solid:clipboard-document-list';
            default:
                return 'heroicons_solid:question-mark-circle';
        }
    }

    createSprint(){
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "primary",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, create it!"
        }).then((result) => {
            if (result.isConfirmed) {
                this.backLogService.createSprint(this.teamId).subscribe({
                    next: () => {
                        this.getBacklogTeam(this.teamId);
                        this.toastService.success(['Sprint created successfully']);
                    },
                    error: (error) => {
                        this.toastService.showErrorMessage(error);
                    },
                    complete: () => {
                        this.changeDetectorRef.detectChanges();
                    }
                });
            }
        });
    }

    startSprint(sprintId:Number, number: number){
        this.dialogService.openModal(Modals.START_SPRINT_DIALOG, {
            sprintId: sprintId,
            number: number,
            callback: () => {
                this.getBacklogTeam(this.teamId);
            }
        }, StartSprintDialogComponent);
    }

    createTask(sprintId: number){
        this.dialogService.openModal(Modals.CREATE_TASK_DIALOG, {
            teamId: this.teamId,
            sprintId: sprintId,
            callback: () => {
                this.getBacklogTeam(this.teamId);
            }
        }, CreateTaskDialogComponent);
    }

    @HostListener('document:keydown', ['$event'])
    handlePressKeyboardEvent(event: KeyboardEvent) {
        if(event.key === 'Control')
        {
            this.ctrlPressed = true;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleUpKeyboardEvent(event: KeyboardEvent) {
        if(event.key === 'Control')
        {
            this.ctrlPressed = false;
            setTimeout(() => {
                this.selectedTasks = [];
            }, 400);
        }
    }
}


