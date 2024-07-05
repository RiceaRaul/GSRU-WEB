import { Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';

export default [
    {
        path     : '',
        component: ErrorPageComponent,
        data:{
            code: '404',
            messageError:'ERRORS.NOT_FOUND'
        }
    }
] as Routes;
