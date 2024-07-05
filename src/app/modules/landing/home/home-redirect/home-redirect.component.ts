import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'app/_core/services/storage.service';

@Component({
    selector: 'app-home-redirect',
    standalone: true,
    imports: [
        CommonModule
    ],
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeRedirectComponent implements OnInit {

    constructor(
        private router:Router,
        private storageService: StorageService
    ) { }

    ngOnInit(): void {
        const team = this.storageService.getSelectedTeam();
        this.router.navigate(['/home', team]);
    }
}
