import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_PRINT_DATA, PRINT_DATA } from '../constants/print.const';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({
  providedIn: 'root'
})
export class PrintService {
    private printSubject = new BehaviorSubject<PRINT_DATA<any>>(DEFAULT_PRINT_DATA);
    printObservable = this.printSubject.asObservable();

    constructor() { }

    printComponent(component: PRINT_DATA<any>) {
        this.printSubject.next(component);
    }
}
