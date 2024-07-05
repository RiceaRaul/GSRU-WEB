import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ResizeColumnDirective } from 'app/_core/directives/resize-column.directive';
import { TitlecasePipe } from 'app/_core/pipes/titlecase.pipe';
import { Subscription } from 'rxjs';
import { TableService } from 'app/_core/services/table.service';
import { TABLE_ACTIONS } from 'app/_core/constants/constants.const';


@Component({
    selector: 'custom-table',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatPaginatorModule, ResizeColumnDirective, TitlecasePipe],
    templateUrl: './custom-table.component.html',
    styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent implements OnInit, OnDestroy, AfterViewInit{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    //eslint-disable-next-line
    @ViewChild(MatTable) table: MatTable<any>;

    @Input() columnsName: string[] = [];
    @Input() columnType: Record<string, string> = undefined;

    //eslint-disable-next-line
    @Input() dataSource: any[] = [];
    @Input() editable: Record<string,boolean> = {}
    //eslint-disable-next-line
    dataSourceTable = new MatTableDataSource<any>();
    tableSubscription?: Subscription;

    tableInitialized = false;
    partialSumLedger: number = 0;
    partialSumLedgerId: number = -1;

    constructor(private readonly tableService: TableService) { }

    ngOnInit(): void {
        if (this.dataSource.length == 0) {
            this.subscribeTableService();
            return;
        }
        else{
            this.subscribeTableService();
            this.initializeTable();
        }
    }

    ngAfterViewInit(): void {
        // this.dataSourceTable.paginator = this.paginator;
    }

    initializeTable(): void {
        this.dataSourceTable = new MatTableDataSource(this.dataSource);
        if (this.columnsName.length == 0) {
            this.columnsName = Object.keys(this.dataSource[0]);
        }

        if (this.columnType == undefined) {
            this.columnType = {};
            for (const column of this.columnsName) {
                if (this.dataSource[0][column] instanceof Date) {
                    this.columnType[column] = 'date';
                }
                else {
                    this.columnType[column] = typeof this.dataSource[0][column];
                }
            }
        }

        // this.dataSourceTable.paginator = this.paginator;
    }

    onInputChange(event: any, row: any, column: string): void {
        let value = parseFloat(event.target.value);
        const minValue = 0;
        const maxValue = 1;
    
        debugger;
        if (value < minValue) {
            value = minValue;
        } else if (value > maxValue) {
            value = maxValue;
        }
    
        event.target.value = value;
        this.dataSource.at(this.dataSource.indexOf(row))[column] = value;
        this.tableService.notifyChanges(TABLE_ACTIONS.TABLE_INPUT_CHANGE);
    }

    ngOnDestroy(): void {
        this.tableSubscription.unsubscribe();
    }

    subscribeTableService() {
        this.tableSubscription = this.tableService.tableModified$.subscribe({
            next: (action: TABLE_ACTIONS) => {
                if (action === TABLE_ACTIONS.LENGTH_CHANGED) {
                    this.dataSourceTable.data = this.dataSource;
                    if (!this.tableInitialized) {
                        this.initializeTable();
                        this.tableInitialized = true;
                    }
                }
            }
        });
    }
}
