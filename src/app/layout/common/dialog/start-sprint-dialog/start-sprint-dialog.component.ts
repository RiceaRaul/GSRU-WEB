import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BacklogService } from 'app/_core/api/backlog.service';
import { DialogService } from 'app/_core/services/dialog.service';
import { ToastService } from 'app/_core/services/toast.service';

@Component({
    selector: 'app-start-sprint-dialog',
    standalone: true,
    imports: [
        CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule
    ],
    templateUrl: './start-sprint-dialog.component.html',
    styleUrl: './start-sprint-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartSprintDialogComponent implements OnInit { 

    sprint_id: number;
    sprint_number: number;
    sprintGoalCtrl = new FormControl();
    constructor(
        private dialogService: DialogService,
        private backlogService: BacklogService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.sprint_id = this.dialogService.params.sprintId;
        this.sprint_number = this.dialogService.params.number;
    }

    closeDialog() {
        this.dialogService.closeModal();
    }

    startSprint() {
        this.backlogService.startSprint(this.sprint_id, this.sprintGoalCtrl.value).subscribe({
            next: () => {
                this.toastService.success([`Sprint ${this.sprint_number} started successfully`]);
                this.dialogService.params.callback();
                this.dialogService.closeModal();
            },
            error: (error: HttpErrorResponse) => {
                this.toastService.showErrorMessage(error);
                this.dialogService.closeModal();
            }
        });
    }
}
