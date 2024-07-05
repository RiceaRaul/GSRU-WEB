import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_ACTIONS } from '../constants/constants.const';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private tableModifiedSource = new BehaviorSubject<TABLE_ACTIONS>(null);
  tableModified$ = this.tableModifiedSource.asObservable();
 
  constructor() { }
 
  notifyChanges(action: TABLE_ACTIONS){
    this.tableModifiedSource.next(action);
  }
 
}
