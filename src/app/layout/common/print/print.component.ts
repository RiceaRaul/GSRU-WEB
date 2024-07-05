import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PRINT_COMPONENTS, PRINT_DATA } from 'app/_core/constants/print.const';
import { PrintService } from 'app/_core/services/print.service';
import { Subscription } from 'rxjs';

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrl: './print.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintComponent implements OnInit, OnDestroy {
    @Input() component: PRINT_COMPONENTS;
    components = PRINT_COMPONENTS;
    printSubscription: Subscription;
    data: any;

    constructor(
        private printService: PrintService,
        private changeDetectorRef: ChangeDetectorRef,
        ) { }

    ngOnInit(): void {
        this.printSubscription = this.printService.printObservable.subscribe({
            next: (printData: PRINT_DATA<any>) => {
                this.component = printData.component;
                this.data = printData.data;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.component = PRINT_COMPONENTS.EXAMPLE_PRINT;
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.printSubscription.unsubscribe();
    }
 }
