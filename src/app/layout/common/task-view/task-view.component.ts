import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, InputSignal, OnInit, OutputEmitterRef, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { BacklogService } from 'app/_core/api/backlog.service';
import { BoardConfiguration } from 'app/_core/models/board.types';
import { Task } from 'app/_core/models/task.types';
import { ToastService } from 'app/_core/services/toast.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { DialogService } from 'app/_core/services/dialog.service';
import { Modals } from 'app/_core/constants/modals.const';
import { CreateTaskDialogComponent } from '../dialog/create-task-dialog/create-task-dialog.component';
import { TaskService } from 'app/_core/api/task.service';
import { QuillEditorComponent, QuillModule, QuillViewComponent } from 'ngx-quill';
import { UploadFilesComponent } from '../uploadFiles/uploadFiles.component';
import { HttpErrorResponse } from '@angular/common/http';
import { LogTimeDialogComponent } from '../dialog/log-time-dialog/log-time-dialog.component';

@Component({
    selector: 'app-task-view',
    standalone: true,
    imports: [
        CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatOptionModule, MatSelectModule, TranslocoModule, MatTooltipModule, MatExpansionModule,QuillEditorComponent, QuillViewComponent, QuillModule
    ],
    templateUrl: './task-view.component.html',
    styleUrl: './task-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskViewComponent implements OnInit{
    teamId: InputSignal<number> = input<number>(0);
    task: InputSignal<Task> = input<Task>(null);
    sprintId: InputSignal<number> = input<number>(0);
    boardConfiguration: InputSignal<BoardConfiguration[]> = input<BoardConfiguration[]>([]);
    closeMethod: OutputEmitterRef<void> = output<void>()
    afterCreateTask: OutputEmitterRef<void> = output<void>()
    currentStatus = 0;
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            ['clean'],
        ],
    };

    commentBody = new FormControl('', [Validators.required]);

    isAddComment: boolean = false;
    constructor(
        private backlogService: BacklogService, 
        private changeDetectorRef: ChangeDetectorRef,
        private toastrService: ToastService, 
        private dialogService: DialogService,
        private taskService: TaskService,
    ) {
    }

    ngOnInit(): void {
        this.currentStatus = this.boardConfiguration().find(x=>x.name == this.task().taskStatus)?.id || 0;
    }

    close(){
        this.closeMethod.emit();
    }

    changeStatus(){
        this.backlogService.updateTaskStatus(this.task().id, this.currentStatus).subscribe({
            error: () => {
                this.toastrService.error(['Error updating task status']);
            }
        });
    }

    createTask(){
        this.dialogService.openModal(Modals.CREATE_TASK_DIALOG, {
            teamId: this.teamId(),
            sprintId: this.sprintId(),
            parent_id: this.task().id,
            callback: () => {
                this.afterCreateTask.emit();
            }
        }, CreateTaskDialogComponent);
    }

    assigneToMe(){
        this.taskService.assigneEmployeeToTask({taskId: this.task().id}).subscribe({
            next: () => {
                this.toastrService.success(['Task assigned']);
            },
            error: () => {
                this.toastrService.error(['Error assigning task']);
            }
        });
    }

    addComment(){
        if(!this.commentBody.valid || this.commentBody.value == ''){
            this.commentBody.setErrors({required: true});
        }
        this.isAddComment = false;
        this.taskService.addComment({taskId: this.task().id, comment: this.commentBody.value}).subscribe({
            next: () => {
                this.toastrService.success(['Comment added']);
                this.commentBody.setValue('');
            },
            error: () => {
                this.toastrService.error(['Error adding comment']);
            }
        });
    }

    uploadFile(){
        this.dialogService.openModal(Modals.FILE_UPLOAD_DIALOG, {
            isFromDialog: true,
            uploadDialogMethod:this.uploadDialogMethod,
            otherParams: [this.task().id, this.taskService]
        }, UploadFilesComponent);
    }

    uploadDialogMethod(files: any[], taskId: number, taskService: TaskService){
        console.log(files, taskId);
        var formData = new FormData();
        formData.append("taskId", taskId.toString());
        files.forEach(file => {
            formData.append("files", file);
        });

        taskService.addAttachment(formData).subscribe({
            next: () => {
                this.toastrService.success(['Files uploaded']);
            },
            error: () => {
                this.toastrService.error(['Error uploading files']);
            }
        });
    }

    downloadFile(id:number){
        this.taskService.downloadTaskAttachment(id).subscribe((blob)=>{console.log(blob)});
    }

    addLogTime(){
        this.dialogService.openModal(Modals.LOG_TIME_DIALOG, {
            task:this.task()
        }, LogTimeDialogComponent);
    }
}
