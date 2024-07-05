import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime } from 'rxjs';

@Component({
    selector: 'app-debounce-input',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule,FormsModule],
    templateUrl: './debounce-input.component.html',
    styleUrl: './debounce-input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebounceInputComponent implements OnInit, OnDestroy, OnChanges{
    @Input() placeholder: string;
    @Input() debounceTimeMs: number = 300;
    @Input() triggerOnEmpty: boolean = true;
    @Input() defaultValue: string = '';
    @Input() disabled: boolean = false;
    @Output() performSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() emptyPerformSearch: EventEmitter<void> = new EventEmitter<void>();

    inputValue:string = '';

    private searchSubject = new Subject<string>();

    ngOnInit(): void {
        this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((value) => {
            if(!this.triggerOnEmpty && this.inputValue === ''){
                this.emptyPerformSearch.emit();
                return;
            }
            this.performSearch.emit(value);
        });
        
    }

    ngOnChanges(): void {
        this.inputValue = this.defaultValue;
        this.onSearch();
    }

    ngOnDestroy(): void {
        this.searchSubject.complete();
    }

    onSearch() {
        this.searchSubject.next(this.inputValue);
      }
 }
