import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const birthDate = moment(control.value);
        if (!birthDate.isValid()) {
            return { invalidDate: true };
        }

        const today = moment();
        const age = today.diff(birthDate, 'years');

        return age >= minAge ? null : { minimumAge: { value: control.value } };
    };
}
