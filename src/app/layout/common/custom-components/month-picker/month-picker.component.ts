import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-month-picker',
    standalone: true,
    imports: [
        CommonModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule
    ],
    templateUrl: './month-picker.component.html',
    styleUrl: './month-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:[
        provideMomentDateAdapter(MY_FORMATS),
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MonthPickerComponent),
            multi: true
        }
    ]
})
export class MonthPickerComponent implements ControlValueAccessor, AfterViewInit {
    @ViewChild(MatDatepicker) _picker: MatDatepicker<Moment>;

    _inputCtrl = new FormControl();
    disabled = false;
    onChange = (monthAndYear: Date) => { };
    onTouched = () => { };

    ngAfterViewInit(): void {

    }

    writeValue(date: Date): void {
        this._inputCtrl.setValue(moment(date));
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        isDisabled
        ? (this.disabled = true)
        : (this.disabled= false);
        
        isDisabled ? this._inputCtrl.disable() : this._inputCtrl.enable();
    } 


    _monthSelectedHandler(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        console.log(normalizedMonthAndYear)
        const ctrlValue = this._inputCtrl.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this._inputCtrl.setValue(ctrlValue);
        datepicker.close();
        this.onChange(this._inputCtrl.value);
    }
}
