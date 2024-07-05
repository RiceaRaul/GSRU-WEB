import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { toast } from '../constants/toastr.const';
import { HttpErrorResponse } from '@angular/common/http';
import Utils from '../helpers/utils';
import { BaseResponse } from '../models/base-response.types';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<boolean>();
    toastObservable? = this.toastSubject.asObservable();
    theme?: boolean = false;

    constructor(
        private translateService: TranslocoService
    ) {
     }

    showErrorMessage(error: HttpErrorResponse): void {
        if(error.error != null && error.error.errors != null){
            const errors = Utils.getValidationApiError(error.error.errors);
            let errorMessage = '';
            for(const message of errors){
                for(const subMessage of message){
                    errorMessage += subMessage + '\n';
                }
            }
            this.error([errorMessage]);
        }
        if(Utils.isBaseResponse(error.error)){
            const errorApi = error.error as BaseResponse<string>;
            this.error([errorApi.apiError.message]);
        }
    }

    success(messagePath: string[], param: { [key: string]: string} = {}): void {
        toast.fire({
            icon: "success",
            title: this.translateService.translate(messagePath, param),
        });
    }

    error(messagePath: string[], param: { [key: string]: string} = {}): void {
        toast.fire({
            icon: "error",
            title: this.translateService.translate(messagePath, param),
        });
    }

    info(messagePath: string[], param: { [key: string]: string} = {}): void {
        toast.fire({
            icon: "info",
            title: this.translateService.translate(messagePath, param),
        });
    }

    warning(messagePath: string[], param: { [key: string]: string} = {}): void {
        toast.fire({
            icon: "warning",
            title: this.translateService.translate(messagePath, param),
        });
    }
}
