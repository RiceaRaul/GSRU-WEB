import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogService } from 'app/_core/services/dialog.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkloadData } from 'app/_core/models/workload.types';
import { CustomTableComponent } from '../../custom-table/custom-table.component';
import { MatInputModule } from '@angular/material/input';
import { TableService } from 'app/_core/services/table.service';
import Utils from 'app/_core/helpers/utils';
import { TABLE_ACTIONS } from 'app/_core/constants/constants.const';
import { reduce } from 'lodash';
import { MatButtonModule } from '@angular/material/button';
import { format } from 'date-fns/format';
import _ from 'lodash';
import { WorkloadService } from 'app/_core/api/workload.service';
import { ToastService } from 'app/_core/services/toast.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-workload-dialog',
    standalone: true,
    imports: [
        CommonModule, MatFormFieldModule, MatDatepickerModule, ReactiveFormsModule, CustomTableComponent, MatInputModule, FormsModule, MatButtonModule
    ],
    templateUrl: './workload-dialog.component.html',
    styleUrl: './workload-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideNativeDateAdapter()]
})
export class WorkloadDialogComponent implements OnInit{
    @ViewChild(CustomTableComponent) customTableComponent: CustomTableComponent;
    sprintId: number = 0;
    workloadData: WorkloadData | null = null;
    
    tableHeader = []
    editableHeader = {}
    totalHours = 0;
    total = ''
    totalWithSupport =''
    range = new FormGroup({
        start: new FormControl<Date>(null, [Validators.required]),
        end: new FormControl<Date>(null, [Validators.required]),
    });

    supportPercent = new FormControl(0, [Validators.required])
    sprintStarted: boolean = false;

    constructor(private dialogService: DialogService, private tableService: TableService, private workloadService: WorkloadService, private changeDetectorRef: ChangeDetectorRef, private toastrService: ToastService) {}

    ngOnInit(): void {
        this.workloadData = this.dialogService.params.data;
        this.sprintStarted = this.dialogService.params.started;
        this.sprintId = this.dialogService.params.sprintId;
        this.range.setValue({start: this.workloadData.dateStart, end: this.workloadData.dateEnd});
        this.updateHeader(new Date(this.range.get("start").value), new Date(this.range.get("end").value));


        this.supportPercent.setValue(this.workloadData.supportPercent);
        this.tableService.tableModified$.subscribe((data) => {
            if(data = TABLE_ACTIONS.TABLE_INPUT_CHANGE){
                if(this.customTableComponent == null){
                    return;
                }
                this.workloadData.data = this.customTableComponent.dataSource;
                this.calculate();
            }
        });

        this.range.valueChanges.subscribe((value) => {
            if(value.start && value.end){
                this.updateHeader(value.start, value.end);
            }
        });

        this.supportPercent.valueChanges.subscribe((value) => {
            this.calculate();
        })

        this.changeDetectorRef.detectChanges();
    }
    

    calculate(){
        if(!this.range.valid){
            return;
        }
        this.totalHours = this.calculateTotalHours();
        this.total = this.calculateTotal();
        this.totalWithSupport = this.calculateTotalWithSupport().toString();
    }

    updateHeader(startDate: Date, endDate: Date){
        const header: Record<string,number | string> = {};
        console.log(startDate, endDate)
        const currentDate = new Date(startDate.getTime());
        currentDate.setHours(0,0,0,0);
        while (currentDate.getTime() <= endDate.getTime()) {
            const dayOfWeek = currentDate.getDay();
            if(dayOfWeek == 6 || dayOfWeek == 0){
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
            }

            const dateString = format(currentDate, "d");
            header[dateString] = 1;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        for(let i=0; i<this.workloadData.data.length; i++){
            var ommitedElement = _.omit(this.workloadData.data[i], Object.keys(this.workloadData.data[i]).filter(x=> Number.isInteger(parseInt(x))));
            for(let key of Object.keys(header)){
                if(this.workloadData.data[i].hasOwnProperty(key)){
                    header[key] = this.workloadData.data[i][key];
                }
            }
            this.workloadData.data[i] = {...ommitedElement, ...header } as any
        }

        this.tableHeader = this.generateHeader();
        this.editableHeader = this.generateEditableHeader();
        this.calculate();
    }

    calculateTotalHours(): number {

        let data = this.workloadData.data;
        let total = 0;
        for (let element of data) {
            for(let key of Object.keys(element)){
                if(Number.isInteger(parseInt(key))){
                    total += parseInt(element[key].toString());
                }
            }
            element.total = total * element.hour;
        }


        return reduce(data, (acc, element) => { return acc + element.total}, 0);
    }

    calculateTotal(){
        let returnString = Utils.computeWeeksDaysHours(this.totalHours);
        return returnString;
    }

    calculateTotalWithSupport() {
        var totalHour = this.totalHours - (this.totalHours * (this.supportPercent.value/100))
        let returnString = Utils.computeWeeksDaysHours(totalHour);
        return returnString;
    }

    generateHeader(): string[] {
        const validHeaders = ['id', 'employee', 'hour', 'total', 'employeeId'];
        var ids = ["id", "employeeId"];

        var header = Object.keys(this.workloadData.data[0]).filter((header: string) => {
            return !validHeaders.includes(header);
        });
        return [...validHeaders.filter(x=> !ids.includes(x)), ...header];
    }

    generateEditableHeader(): Record<string, boolean> {
        const editableHeader = {};
        this.tableHeader.forEach((header: string) => {
            if (header === 'employee' || header === 'total' || header === 'id') {
                editableHeader[header] = false;
            } else {
                editableHeader[header] = true;
            }
        });
        return editableHeader;
    }

    saveWorkload(){
        var startDate = new Date(this.range.get("start").value);
        var endDate = new Date(this.range.get("end").value);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
        var existingZero  = this.containsZero(this.workloadData.data)
        if(existingZero){
            Swal.fire({
                title: "Exista concedii!",
                text: "Doresti sa inregistrezi cererile?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            }).then((result) => {
                if (result.isConfirmed) {
                    this.workloadService.addLeavesWorkload({
                        ...this.workloadData, dateStart:startDate, dateEnd:endDate, supportPercent: this.supportPercent.value
                    }).subscribe((data) => {
                        this.toastrService.success(['Workload saved successfully']);
                    });
                }
            }).finally(()=>{
                this.workloadService.createWorkload({
                    ...this.workloadData, dateStart:startDate, dateEnd:endDate, supportPercent: this.supportPercent.value
                }).subscribe((data) => {
                    this.toastrService.success(['Workload saved successfully']);
                });
            });
        }
    }

    exit(){
        this.dialogService.closeModal();
    }

    containsZero(data) {
        return data.some(obj => {
            return Object.values(obj).some(value => value === 0);
        });
    }
}
