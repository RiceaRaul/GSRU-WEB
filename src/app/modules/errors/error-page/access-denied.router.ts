import { Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';

export default [
    {
        path     : '',
        component: ErrorPageComponent,
        data:{
            code: '401',
            messageError:'ERRORS.ACCESS_DENIED'
        }
    }
] as Routes;
