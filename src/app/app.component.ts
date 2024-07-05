import { Component, HostListener, OnInit } from '@angular/core';
import { PrintService } from './_core/services/print.service';
import { DEFAULT_PRINT_DATA} from './_core/constants/print.const';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    constructor(private printService: PrintService) { }

    ngOnInit(): void
    {
        this.printService.printComponent(DEFAULT_PRINT_DATA);
    }

    @HostListener('window:afterprint')
    onAfterPrint() {
        this.printService.printComponent(DEFAULT_PRINT_DATA);
    }
}
