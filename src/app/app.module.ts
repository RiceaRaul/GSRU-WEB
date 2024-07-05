import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { CoreModule } from './_core/core.module';
import { DialogContainerComponent } from "./layout/common/dialog/dialog-container/dialog-container.component";
import { PrintComponent } from './layout/common/print/print.component';

@NgModule({
    declarations: [
        AppComponent,
        PrintComponent
    ],
    bootstrap: [AppComponent,PrintComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        CoreModule,
        DialogContainerComponent
    ]
})

export class AppModule { }
