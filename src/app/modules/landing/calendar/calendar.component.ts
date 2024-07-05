import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { TaskService } from 'app/_core/api/task.service';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { GetWorklogsByEmployeeId } from 'app/_core/models/task.types';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/_core/services/user.service';
import { User } from 'app/_core/models/user.types';
import { AuthUtils } from 'app/_core/helpers/auth.utils';
import Utils from 'app/_core/helpers/utils';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [
        CommonModule, FullCalendarModule 
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit{

    @ViewChild('calendar') calendar!: FullCalendarComponent;
    calendarOptions: CalendarOptions;
    events: any = [];
    constructor(public fb: FormBuilder, private taskService: TaskService, private changeDetectorRef: ChangeDetectorRef, private router: ActivatedRoute, private userService: UserService) {

    }
    user:User;
    ngOnInit(): void {
        this.initCalendar();
        this.userService.user$.subscribe((data:User) => {
            this.user = data;
            this.router.queryParams.subscribe({
                next: (params) => {
                    if(this.isTeamLead()){
                        if(Object.hasOwn(params, 'id')){
                            this.getEvents(params.id)
                        }
                        else{
                            this.getEvents();
                        }
                    }
                    else{
                        this.getEvents();
                    }
                }
            })
        });
    }

    isTeamLead(){
        return Utils.isTeamLead(this.user.token);
    }
    
    initCalendar(){
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
            },
            editable: true,
            dayMaxEvents: true,
            selectable: true,
            droppable: true,
            eventClick: (event: any) => {
               // this.editEvent(event);
            },
            select: (event: any) => {
               //this.editDate(event);
            },
        };
    }

    getEvents(id = null) {
        if(id != null){
            this.taskService.getWorkLogsByEmployeeById(id).subscribe({
                next: (res:GenericReponse<GetWorklogsByEmployeeId[]>) => {
                    this.events = res.data.map((item) => {
                        return {
                            id: item.id,
                            title: item.taskName,
                            start: item.startTime.toString(),
                            end: item.endTime.toString(),
                            description: item.description,
                            className: 'primary',
                        };
                    });
                    this.calendarOptions.events = this.events;
    
                    this.changeDetectorRef.detectChanges();
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }
        else{
            this.taskService.getWorkLogsByEmployee().subscribe({
                next: (res:GenericReponse<GetWorklogsByEmployeeId[]>) => {
                    this.events = res.data.map((item) => {
                        return {
                            id: item.id,
                            title: item.taskName,
                            start: item.startTime.toString(),
                            end: item.endTime.toString(),
                            description: item.description,
                            className: 'primary',
                        };
                    });
                    this.calendarOptions.events = this.events;
    
                    this.changeDetectorRef.detectChanges();
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }
    }

    getMonth(dt: Date, add: number = 0) {
        let month = dt.getMonth() + 1 + add;
        const str = (month < 10 ? '0' + month : month).toString();
        return str;
    }
}
