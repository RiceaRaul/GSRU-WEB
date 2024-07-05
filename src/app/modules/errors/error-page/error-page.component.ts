import {  ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ErrorImageComponent } from 'app/layout/common/error-image/error-image.component';

@Component({
    selector: 'app-access-denied',
    standalone: true,
    imports: [
        RouterLink,TranslocoModule,ErrorImageComponent
    ],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent{
    code: string;
    messageError: string;

    constructor(private route:ActivatedRoute){
        this.code = route.snapshot.data.code;
        this.messageError = route.snapshot.data.messageError;
    }
}
