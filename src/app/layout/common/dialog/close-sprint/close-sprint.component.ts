import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, InputSignal, OnInit, input } from '@angular/core';
import { Backlog, Sprint } from 'app/_core/models/sprint.types';
import { DialogService } from 'app/_core/services/dialog.service';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BacklogService } from 'app/_core/api/backlog.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-close-sprint',
    standalone: true,
    imports: [
        CommonModule,MatSelectModule,FormsModule,ReactiveFormsModule, MatButtonModule
    ],
    templateUrl: './close-sprint.component.html',
    styleUrl: './close-sprint.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseSprintComponent implements OnInit{ 
    sprint:Sprint;

    totalTasks = 0;
    completedTasks = 0;
    teamId: number = 0;
    sprints: Sprint[] = [];

    newSprintId = new FormControl(0,[Validators.required]);
    constructor(private dialogService: DialogService, private backlogSerivce:BacklogService, private backlogService: BacklogService) {}

    ngOnInit(): void {
        this.sprint = this.dialogService.params.sprint;
        this.teamId = this.dialogService.params.teamId;
        this.totalTasks = this.sprint.tasks.length + this.sprint.tasks.reduce((acc, task) => acc + task.children.length, 0);
        this.completedTasks = this.sprint.tasks.filter(task => task.taskStatus.toLocaleLowerCase() === 'done').length + this.sprint.tasks.reduce((acc, task) => acc + task.children.filter(task => task.taskStatus.toLocaleLowerCase() === 'done').length, 0);


        this.backlogSerivce.getBacklog(this.teamId).subscribe({
            next: (res:Backlog) => {
                this.sprints = res.sprints.filter(sprint => sprint.id !== this.sprint.id);
                this.newSprintId.setValue(this.sprints[0].id);
            }
        });
    }

    closeDialog(): void {
        this.dialogService.closeAll();
    }

    closeSprint(): void {
        var taskIds = []
        //taskIds.push(...this.sprint.tasks.filter(task => task.taskStatus.toLocaleLowerCase() !== 'done').map(task => task.id));
        this.sprint.tasks.forEach(task => {
            if(task.taskStatus.toLocaleLowerCase() !== 'done'){
                taskIds.push(task.id);
                task.children.forEach(child => {
                    taskIds.push(child.id);
                });
            }
        });
        var payload = {
            sprintId: this.sprint.id,
            nextSprintId: this.newSprintId.value,
            taskIds: taskIds
        }
        this.backlogService.closeSprint(payload).subscribe({
            next: () => {
                this.dialogService.closeAll();
            }
        });
    }
}
