import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, InputSignal, OnInit, OutputEmitterRef, ViewChild, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DndDirective } from 'app/_core/directives/dnd.directive';
import { DialogService } from 'app/_core/services/dialog.service';

@Component({
    selector: 'app-upload-files',
    standalone: true,
    imports: [
        CommonModule, DndDirective, MatIconModule, MatButtonModule, MatProgressBarModule
    ],
    templateUrl: './uploadFiles.component.html',
    styleUrl: './uploadFiles.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFilesComponent implements OnInit{

    multiple: InputSignal<boolean> = input(false);
    accept: InputSignal<string> = input('*');
    uploadEvent:OutputEmitterRef<any[]> = output<any[]>();

    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    files: any[] = [];
    isFromDialog: boolean = false;
    uploadDialogMethod: (files:any[], ...otherParams:any[]) => void;
    otherParams: any[] = [];
    constructor(private dialogService:DialogService) { }

    ngOnInit(): void {
        const params = this.dialogService.params;
        if(Object.hasOwnProperty.call(params, 'isFromDialog')) {
            this.isFromDialog = params.isFromDialog;
        }
        if(Object.hasOwnProperty.call(params, 'uploadDialogMethod')) {
            this.uploadDialogMethod = params.uploadDialogMethod;
        }

        if(Object.hasOwnProperty.call(params, 'otherParams')) {
            this.otherParams = params.otherParams;
        }
    }
    onFileDropped($event) {
        this.prepareFilesList($event);
    }

    fileBrowseHandler(files) {
        this.prepareFilesList(files);
    }

    deleteFile(index: number) {
        this.files.splice(index, 1);
    }

    prepareFilesList(files: Array<any>) {
        for (const item of files) {
            this.files.push(item);
        }
        this.fileDropEl.nativeElement.value = "";
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return "0 Bytes";
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    uploadFiles() {
        if(this.isFromDialog){
            this.uploadDialogMethod(this.files, ...this.otherParams);
            return;
        }
        this.uploadEvent.emit(this.files);
    }
}
