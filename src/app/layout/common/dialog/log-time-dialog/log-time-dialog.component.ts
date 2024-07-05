import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';
import { DialogService } from 'app/_core/services/dialog.service';
import { Task } from 'app/_core/models/task.types';
import Utils from 'app/_core/helpers/utils';
import PayloadUtils from 'app/_core/helpers/payload.utils';
import { TaskService } from 'app/_core/api/task.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-log-time-dialog',
    standalone: true,
    imports: [
        CommonModule,MatInputModule,MatFormFieldModule,ReactiveFormsModule, FormsModule ,MatDatepickerModule, NgxMaterialTimepickerModule, MatButtonModule
    ],
    templateUrl: './log-time-dialog.component.html',
    styleUrl: './log-time-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogTimeDialogComponent implements OnInit{

    public timeTrackingForm;
    currentDate: DateTime;
    task:Task;
    remainingTime: string;
    constructor(private fb:FormBuilder, private dialogService: DialogService, private taskService:TaskService) {}
    
    ngOnInit(): void {
        this.task = this.dialogService.params.task;
        this.currentDate = DateTime.now();
        this.timeTrackingForm = this.fb.group({
            date:[this.currentDate,[Validators.required]],
            time:[`${this.currentDate.hour}:${this.currentDate.minute}`,[Validators.required]],
            duration:['30m',[Validators.required, Validators.pattern(/(\d+)[wW]\s*|(\d+)[dD]\s*|(\d+)[hH]\s*|(\d+)[mM]\s*/)]],
            comment:['Working on issue',[Validators.required]]
        });
        this.remainingTime = Utils.computeWeeksDaysHours(this.task.remainingTime);
        this.calculateRemainingTime();
        this.duration.valueChanges.subscribe((value) => {
            if(this.duration.valid){
                this.calculateRemainingTime();
            }
        });
    }

    saveLoggingTime(){
        var startDate = this.timeTrackingForm.get('date').value;
        var time = this.timeTrackingForm.get('time').value.split(':');
        startDate = startDate.set({hour:time[0],minute:time[1]});
        var endDate = startDate.set({minute:startDate.minute + Utils.parseDuration(this.duration.value)});
        var payload = PayloadUtils.ComputeLogTimePayload(this.task.id, startDate,endDate,this.comment.value);
        this.taskService.logTime(payload).subscribe({
            next: () => {
                this.dialogService.closeAll();
            },
            error: (error: HttpErrorResponse) => {
                //this.dialogService.closeAll();
            }
        });
    }



    computeWeeksDaysHours(duration:number) {
        return Utils.computeWeeksDaysHours(duration)
    }

    calculateRemainingTime(){
        const duration = Utils.parseDuration(this.duration.value);
        const remainingTime = this.task.remainingTime - duration;
        if(remainingTime < 0){
            this.remainingTime = '0m';
            return;
        }
        this.remainingTime = this.computeWeeksDaysHours(remainingTime);
        
    }

    get time(){
        return this.timeTrackingForm.get('time');
    }

    get duration(){
        return this.timeTrackingForm.get('duration');
    }

    get comment(){
        return this.timeTrackingForm.get('comment');
    }

    close(){
        this.dialogService.closeAll();
    }
}
