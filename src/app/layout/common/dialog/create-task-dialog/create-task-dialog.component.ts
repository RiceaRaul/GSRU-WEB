import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogService } from 'app/_core/services/dialog.service';
import { InputSelectComponent } from '../../custom-components/input-select/input-select.component';
import { BacklogService } from 'app/_core/api/backlog.service';
import { TaskTypeStatusResponse } from 'app/_core/models/task.types';
import PayloadUtils from 'app/_core/helpers/payload.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'app/_core/services/toast.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    selector: 'app-create-task-dialog',
    standalone: true,
    imports: [
        CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatIconModule, InputSelectComponent, TranslocoModule
    ],
    templateUrl: './create-task-dialog.component.html',
    styleUrl: './create-task-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskDialogComponent implements OnInit{ 


    taskTypes: TaskTypeStatusResponse;
    taskStatus: TaskTypeStatusResponse;
    constructor(
        private fb: FormBuilder,
        private dialogService: DialogService,
        private backlogService: BacklogService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.backlogService.getTaskTypes().subscribe((res: TaskTypeStatusResponse) => {
            this.taskTypes = res;
        });

        this.backlogService.getTaskStatus(this.dialogService.params.teamId).subscribe((res: TaskTypeStatusResponse) => {
            this.taskStatus = res;
        });
    }

    taskForm = this.fb.group({
        title: ['', [Validators.required]],
        description: [''],
        priority: [''],
        type: ['', [Validators.required]],
        estimate: ['',[Validators.pattern(/(\d+)[wW]\s*|(\d+)[dD]\s*|(\d+)[hH]\s*|(\d+)[mM]\s*/)]],
        story_points: ['', [Validators.pattern(/^[0-9]*$/)]],
        status : [''],
    });

    get title() {
        return this.taskForm.get('title');
    }

    get description() {
        return this.taskForm.get('description');
    }

    get priority() {
        return this.taskForm.get('priority');
    }

    get type() {
        return this.taskForm.get('type');
    }


    get estimate() {
        return this.taskForm.get('estimate');
    }

    get story_points() {
        return this.taskForm.get('story_points');
    }
    
    get status() {
        return this.taskForm.get('status');
    }

    createTask() {
        if (this.taskForm.valid) {
            const payload = PayloadUtils.ComputeCreateTaskPayload(
                this.title.value, 
                this.description.value, 
                this.dialogService.params.parent_id, 
                0,
                this.estimate.value, 
                parseInt(this.story_points.value), 
                parseInt(this.type.value),
                parseInt(this.status.value), 
                parseInt(this.priority.value), 
                this.dialogService.params.teamId, 
                this.dialogService.params.sprintId
            );
            this.backlogService.createTask(payload).subscribe({
                next: () => {
                    this.dialogService.params.callback();
                    this.dialogService.closeModal();
                },
                error: (error: HttpErrorResponse) => {
                    this.toastService.showErrorMessage(error);
                }
            });
        }
    }

    closeDialog() {
        this.dialogService.closeModal();
    }
}
