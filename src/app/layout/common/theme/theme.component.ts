import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'app/_core/models/user.types';
import { UserService } from 'app/_core/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import {  MatSlideToggleModule } from '@angular/material/slide-toggle';
import {  MatIconModule } from '@angular/material/icon';
import { FuseConfigService, Scheme } from '@fuse/services/config';
import Utils from 'app/_core/helpers/utils';

@Component({
  selector: 'theme',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatIconModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('toggle', {read: ElementRef}) themeSlider?: ElementRef

  user:User;
  // eslint-disable-next-line
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  theme = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _fuseConfigService: FuseConfigService){}

  ngOnInit(): void {
     this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.user = user;

                this.setScheme(this.theme ? "dark" : "light");
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
  }

  ngAfterViewInit(): void {
    Utils.replaceThemeSlider(this.themeSlider!);
  }

  changeTheme(): void{
    this.theme = !this.theme;
    this.setScheme(this.theme ? "dark" : "light");
  }

  setScheme(scheme: Scheme): void
  {
      this._fuseConfigService.config = {scheme};
      this._fuseConfigService.config = {theme: scheme === 'dark' ? 'theme-amber' : 'theme-purple'};
  }

  ngOnDestroy(): void
    {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }


}
