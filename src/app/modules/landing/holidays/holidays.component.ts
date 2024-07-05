import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { Modals } from 'app/_core/constants/modals.const';
import { DialogService } from 'app/_core/services/dialog.service';
import { AddHolidaysComponent } from 'app/layout/common/dialog/add-holidays/add-holidays.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { HolidaysService } from 'app/_core/api/holidays.service';
import { GenericReponse } from 'app/_core/models/base-response.types';
import { GetWorklogsByEmployeeId } from 'app/_core/models/task.types';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TitlecasePipe } from 'app/_core/pipes/titlecase.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { AuthUtils } from 'app/_core/helpers/auth.utils';
import { UserService } from 'app/_core/services/user.service';
import { User } from 'app/_core/models/user.types';
import { Employee } from 'app/_core/models/employee.types';
@Component({
    selector: 'app-holidays',
    standalone: true,
    imports: [
        CommonModule, MatButtonModule, FullCalendarModule, MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule, TitlecasePipe, MatIconModule, MatTooltip
    ],
    templateUrl: './holidays.component.html',
    styleUrl: './holidays.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaysComponent implements OnInit{ 

    constructor(private _dialogService: DialogService, private _holidayService:HolidaysService, private changeDetectorRef: ChangeDetectorRef, private userService: UserService) { }
    calendarOptions: CalendarOptions;
    events: any = [];
    leaves = [];
    leavesDataSource = new MatTableDataSource();
    leavesColumns = ['employeeName', 'dataStart', 'dataEnd', 'status', 'actions']
    columnsType = {
        employeeName: 'text',
        dataStart: 'date',
        dataEnd: 'date',
        status: 'text',
    }
    user:User;
    employeeData: Employee;
    ngOnInit(): void {
        this.initCalendar();
        this.getEvents();
        this.userService.user$.subscribe((data:User) => {
            this.user = data;
        });
        this.userService.userData$.subscribe((data:Employee) => {
            this.employeeData = data;
        });
    }

    addHoliday() {
        this._dialogService.openModal(Modals.ADD_HOLIDAYS_DIALOG, {}, AddHolidaysComponent)
    }

    initCalendar(){
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek',
            },
            editable: false,
            dayMaxEvents: true,
            selectable: false,
            droppable: false,
            eventClick: (event: any) => {
               // this.editEvent(event);
            },
            select: (event: any) => {
               //this.editDate(event);
            },
        };
    }

    getEvents() {
        this._holidayService.getLeaves().subscribe({
            next: (res:GenericReponse<GetWorklogsByEmployeeId[]>) => {
                this.events = this.createTasks(res.data);
                this.calendarOptions.events = this.events;

                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    
    selectedTabChange(event: MatTabChangeEvent ){
        if(event.index == 1){
            this.getAprovedLeaves();
        }
    }

    getAprovedLeaves() {
        this._holidayService.getApproveLeaves().subscribe({
            next: (res:GenericReponse<any[]>) => {
                this.leaves = res.data;
                this.leavesDataSource = new MatTableDataSource(this.leaves);
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                console.log(error);
            },
        })
    }

    createTasks(tasks) {
        const newTasks = [];
    
        tasks.forEach(item => {
            let startDate = new Date(item.startTime);
            const endDate = new Date(item.endTime);
    
            while (startDate <= endDate) {
                // Skip weekends (Saturday and Sunday)
                if (startDate.getDay() !== 0 && startDate.getDay() !== 6) { // 0 is Sunday, 6 is Saturday
                    // Set start time to 00:00
                    let startDateMidnight = new Date(startDate);
                    startDateMidnight.setHours(0, 0, 0, 0);
    
                    // Set end time to 23:00
                    let endDate2300 = new Date(startDate);
                    endDate2300.setHours(23, 0, 0, 0);
    
                    newTasks.push({
                        id: item.id,
                        title: item.taskName,
                        start: startDateMidnight.toISOString(), // Set start time to 00:00 and convert to ISO string
                        end: endDate2300.toISOString(), // Set end time to 23:00 and convert to ISO string
                        description: item.description,
                        className: 'primary',
                    });
                }
                startDate.setDate(startDate.getDate() + 1); // Move to the next day
            }
        });
    
        return newTasks;
    }

    approveLeave(leave){
        this._holidayService.changeStatusLeave(leave.id,true).subscribe({
            next: () => {
                Swal.fire("Success", "Leave approved", "success").then(()=>{ this.getAprovedLeaves(); });
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    reject(leave){
        this._holidayService.changeStatusLeave(leave.id,false).subscribe({
            next: () => {
                Swal.fire("Success", "Leave rejected", "success").then(()=>{ this.getAprovedLeaves(); });
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    isTeamLead(){
        return AuthUtils.getRoles(this.user.token).includes('Team Lead') || AuthUtils.getRoles(this.user.token).includes('Manager') || AuthUtils.getRoles(this.user.token).includes('HR');
    }
}
