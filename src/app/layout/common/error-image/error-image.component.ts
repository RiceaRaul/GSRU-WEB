import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-error-image',
  standalone: true,
  templateUrl: './error-image.component.html',
  styleUrl: './error-image.component.scss'
})
export class ErrorImageComponent implements AfterViewInit{
    @ViewChild("first_digit") first_digit: ElementRef;
    @ViewChild("last_digit") last_digit: ElementRef;

    @Input() code: string;

    ngAfterViewInit(): void {
        const numbers = this.code.split('');
        this.first_digit.nativeElement.innerHTML = numbers[0];
        this.last_digit.nativeElement.innerHTML = numbers[2];
    }

}
