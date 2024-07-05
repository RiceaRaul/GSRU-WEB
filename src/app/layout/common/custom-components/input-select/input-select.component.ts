import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-input-select',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputSelectComponent),
            multi: true,
        },
    ],
    templateUrl: './input-select.component.html',
    styleUrl: './input-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectComponent implements OnInit, ControlValueAccessor {
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    chipCtrl = new FormControl();
    filteredItems: Observable<string[]>;
    items: string[] = [];
    allItems: string[] = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5'];

    private onChange: any = () => {};
    private onTouched: any = () => {};

    ngOnInit() {
        this.filteredItems = this.chipCtrl.valueChanges.pipe(
            startWith(''),
            map((item: string | null) => item ? this._filter(item) : this.allItems.slice().filter(i => !this.items.includes(i)))
        );
    }

    writeValue(value: any): void {
        if (value) {
            this.items = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.items.push(value.trim());
            this.onChange(this.items);
        }

        if (input) {
            input.value = '';
        }

        this.chipCtrl.setValue(null);
    }

    remove(item: string): void {
        const index = this.items.indexOf(item);

        if (index >= 0) {
            this.items.splice(index, 1);
            this.onChange(this.items);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.items.push(event.option.viewValue);
        this.onChange(this.items);
        this.chipCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allItems.filter(
            (item) => item.toLowerCase().indexOf(filterValue) === 0
        );
    }
}
