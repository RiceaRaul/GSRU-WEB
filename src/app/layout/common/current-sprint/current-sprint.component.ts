import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import _ from 'lodash';
import { TranslocoModule } from '@ngneat/transloco';
import {MatExpansionModule} from '@angular/material/expansion';
import { BoardConfiguration, BoardConfigurationResponse } from 'app/_core/models/board.types';
import { BacklogService } from 'app/_core/api/backlog.service';
import { KeysPipe } from 'app/_core/pipes/keys.pipe';
import { Task } from 'app/_core/models/task.types';
import Utils from 'app/_core/helpers/utils';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Sprint } from 'app/_core/models/sprint.types';
import { DialogService } from 'app/_core/services/dialog.service';
import { Modals } from 'app/_core/constants/modals.const';
import { CloseSprintComponent } from '../dialog/close-sprint/close-sprint.component';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-current-sprint',
    standalone: true,
    imports: [
        CommonModule, MatButtonModule, MatIconModule, MatExpansionModule, DragDropModule, MatBadgeModule, MatChipsModule, MatTooltipModule, TranslocoModule, KeysPipe, TaskViewComponent
    ],
    templateUrl: './current-sprint.component.html',
    styleUrl: './current-sprint.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentSprintComponent { 
    private _teamId: number = 0;
    @Input() set teamId(value: number) {
        this._teamId = value;
        this.getActiveSprint(value);
    };

    get teamId(): number {
        return this._teamId;
    }


    boardConfiguration: BoardConfiguration[] = []

    tasks = {}

    connectedDropLists = {
        Story:[]
    }

    showBoard = false;
    taskSelected = null;
    sprint: Sprint;
    notFound = false;
    constructor(
        private backlogService: BacklogService,
        private changeDetectorRef: ChangeDetectorRef,
        private dialogService: DialogService
    ) {

    }
    addId(i: number, configurationId:number, story: string) {
        const id = `cdk-drop-list-${i}-${configurationId}`;
        if(!this.connectedDropLists[story]){
            this.connectedDropLists[story] = [];
        }
        if(!this.connectedDropLists[story].includes(id)){
            this.connectedDropLists[story].push(id);
        }
        return id;
    }

    drop(event: CdkDragDrop<Task[]>) {
        var splitContainer = event.container.id.split('-');
        var newStatus = event.container.id.split('-').pop()
        var task = event.previousContainer.data[event.currentIndex];
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
        else{
            transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex,
            );
            this.backlogService.updateTaskStatus(task.id, newStatus).subscribe();
        }
        var parent = event.container.id.split('-')[splitContainer.length - 2];
        this.checkTaskHaveAllChildrenDone(parent);
    }

    checkTaskHaveAllChildrenDone(taskId){
        var totalTasks = 0;
        var doneId = this.boardConfiguration.find(config => config.nameShort.toLocaleLowerCase() === 'done').id;
        for(let i = 0; i < this.boardConfiguration.length; i++){
            totalTasks += this.tasks[taskId][this.boardConfiguration[i].nameShort].length;
        }
        var allDone = this.tasks[taskId][this.boardConfiguration.find(config => config.nameShort.toLocaleLowerCase() === 'done').nameShort].length === totalTasks;
        if(!allDone){
            return;
        }

        Swal.fire({
            title: "Task update",
            text: "Do you want to update parent task to done?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                this.backlogService.updateTaskStatus(taskId, doneId).subscribe({
                    next: () => {
                        Swal.fire("Saved!", "", "success");
                        this.getActiveSprint(this._teamId);
                    }
                });
            }
        });
    }

    getActiveSprint(team_id){
        this.backlogService.getBoardConfiguration(team_id).subscribe({
            next: (data: BoardConfigurationResponse) => {
                this.boardConfiguration = data.configuration;
                this.backlogService.getActiveSprint(team_id).subscribe({
                    next: (data: Sprint) => {
                        this.sprint = data;
                        this.prepareTasksData(data);
                    },
                    error: (error: HttpErrorResponse) => {
                        if(error.status === 404){
                            this.notFound = true;
                            this.changeDetectorRef.detectChanges();
                        }
                    }
                });
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    prepareTasksData(data){
        let storys = data.tasks.filter(task => task.children != undefined && task.children.length != 0 ).sort((a, b) => a.index - b.index);
        let other = data.tasks.filter(task => task.children == undefined  || task.children.length == 0 ).sort((a, b) => a.index - b.index);
        for (let i = 0; i < storys.length; i++) {
            if(!this.tasks[storys[i].id]){
                this.tasks[storys[i].id] = {
                    ...storys[i],
                    id: storys[i].id,
                    name: storys[i].name,
                    description: storys[i].description,
                    estimateTime: storys[i].estimateTime,
                    remainingTime: storys[i].remainingTime,
                    storyPoints: storys[i].storyPoints + storys[i].children.reduce((acc, task) => acc + task.storyPoints, 0),
                    taskType: storys[i].taskType,
                    taskStatus: storys[i].taskStatus,
                    priority: storys[i].priority,
                    index: storys[i].index,
                    children: storys[i].children,
                };
            }
            for(let j = 0; j < this.boardConfiguration.length; j++){
                if(!this.tasks[storys[i].id][this.boardConfiguration[j].nameShort]){
                    this.tasks[storys[i].id][this.boardConfiguration[j].nameShort] = [];
                }
                if(storys[i].children == undefined){
                    continue;
                }
                this.tasks[storys[i].id][this.boardConfiguration[j].nameShort] = storys[i].children?.filter(task => task.taskStatus === this.boardConfiguration[j].nameShort);
            }
        }
        
        if(!this.tasks["Other"]){
            this.tasks["Other"] = {
                id:"Other",
                name: "Other",
                description: " ",
                estimateTime: 0,
                remainingTime: 0,
                storyPoints: 0,
                taskType: "Other",
                taskStatus: "",
                priority: "Other",
            };
        }
        for(let j = 0; j < this.boardConfiguration.length; j++){
            if(!this.tasks["Other"][this.boardConfiguration[j].nameShort]){
                this.tasks["Other"][this.boardConfiguration[j].nameShort] = [];
            }
            this.tasks["Other"][this.boardConfiguration[j].nameShort] = other.filter(task => task.taskStatus === this.boardConfiguration[j].nameShort);
        }

        this.showBoard = true;
        this.changeDetectorRef.detectChanges();
    }

    selectTask(task){
        if(this.taskSelected?.id == task.id){
            this.taskSelected = null;
            return;
        }
        this.taskSelected = task;
    }

    closeTaskView(){
        this.taskSelected = null;
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

    convertHours(hours: number){
        return Utils.computeWeeksDaysHours(hours);
    }

    closeSprint(){
        // var totalTasks = this.sprint.tasks.length + this.sprint.tasks.reduce((acc, task) => acc + task.children.length, 0);
        // var completedTasks = this.sprint.tasks.filter(task => task.taskStatus.toLocaleLowerCase() === 'done').length + this.sprint.tasks.reduce((acc, task) => acc + task.children.filter(task => task.taskStatus.toLocaleLowerCase() === 'done').length, 0);
        // var remainingTasks = totalTasks - completedTasks;
        
        // console.log(totalTasks, completedTasks, remainingTasks);

        this.dialogService.openModal(Modals.CLOSE_SPRINT_DIALOG, { sprint: this.sprint, teamId: this._teamId }, CloseSprintComponent)
    }
}
