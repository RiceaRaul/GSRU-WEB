import {  NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { Router, RouterLink } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/_core/api/auth.service';
import { ToastService } from 'app/_core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import PayloadUtils from 'app/_core/helpers/payload.utils';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,MatCheckboxModule,MatProgressSpinnerModule
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {

    signInForm: FormGroup;
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    showAlert: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _toastService: ToastService,
        private _router:Router
    ){}


    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._fb.group({
            email     : ['example@email.com', [Validators.required, Validators.email]],
            password  : ['password', Validators.required],
            rememberMe: [''],
        });
    }

    login(){
        const payload = PayloadUtils.ComputeLoginPayload(this.email.value, this.password.value);
        this._authService.signIn(payload).subscribe({
            next: (user) => {
                this._router.navigate(['/select-team']);
                console.log(user);
            },
            error: (error: HttpErrorResponse) => {
                this._toastService.showErrorMessage(error);
            }
        });
    }

    get email(){
        return this.signInForm.get('email');
    }

    get password(){
        return this.signInForm.get('password');
    }

    get rememberMe(){
        return this.signInForm.get('rememberMe');
    }
}
