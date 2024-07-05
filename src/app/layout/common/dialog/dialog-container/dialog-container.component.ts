import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MODAL_RESPONSE, MODALS_STYLES, Modals } from 'app/_core/constants/modals.const';
import { DialogService } from 'app/_core/services/dialog.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
    selector: 'dialog-container',
    standalone: true,
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type  */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export class DialogContainerComponent implements OnDestroy {
    modalRef?: MatDialogRef<any>;
    modalSubscription: Subscription;

    constructor(
        private dialog: MatDialog,
        private dialogService: DialogService,
        ) {
        this.modalSubscription = dialogService.modal$.subscribe((response: any) => {
          switch (response.closeStatus) {
            case MODAL_RESPONSE.CLOSE:
            case MODAL_RESPONSE.CLOSE_SUCCESS:
              this.closeModal();
              response.source && this.emitCloseEvent(response);
              return;
            case MODAL_RESPONSE.CLOSE_ALL:
              this.dialog.closeAll();
              return;
            default:
              this.setModal(response.modalName, response.component);
          }
          this.modalRef?.backdropClick().subscribe(() => {
            this.closeModal();
            this.emitCloseEvent({ closeStatus: MODAL_RESPONSE.CLOSE, source: response.action });
          });
        });
      }

      emitCloseEvent(event: any): void {
        this.modalRef?.afterClosed().subscribe(() => {
          this.dialogService.emitResponse(event);
        });
      }

      ngOnDestroy() {
        this.modalSubscription.unsubscribe();
      }

      setModal(response: any, component?: any): void {
        const style = MODALS_STYLES.find((modal: any) => modal.name === response)?.style;
        switch (response) {
          case Modals.CREATE_TASK_DIALOG:
            this.openModal(component, style, false);
            break;
          case Modals.START_SPRINT_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.WORKLOG_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.FILE_UPLOAD_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.LOG_TIME_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.CLOSE_SPRINT_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.UPDATE_EMPLOYEE_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.ADD_EMPLOYEE_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.MANAGE_EMP_TEAMS_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.ADD_HOLIDAYS_DIALOG:
              this.openModal(component, style, false);
              break;
          case Modals.ADD_TEAM_DIALOG:
              this.openModal(component, style, false);
              break;
          default:
            break;
        }
      }

      openModal(modalComponent: any, style: any, disableClose: boolean = false, cancel: boolean = false): void {
        if (this.dialog.openDialogs.length && !cancel) {
          this.dialog.closeAll();
        }
        this.modalRef = this.dialog.open(modalComponent, { ...style, disableClose,panelClass:"printable-modal" });//panelClass: this.themeService.isDarkThemeValue ? 'dark-theme' : 'light-theme',
      }

      closeModal(): void {
        this.modalRef?.close();
      }
 }
