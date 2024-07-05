import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() tooltip: string = '';
  @Output() fileUploadedEvent = new EventEmitter<File>();
  uploadedFile:File;
  @Input() isDisabled : boolean = false;

  constructor() {}

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.uploadedFile = event.target.files[0];
      this.fileUploadedEvent.emit(this.uploadedFile);
      event.target.value = null;
    }
  }
}
