import { EnvironmentProviders, Provider } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const provideMatDateFormats = (): Array<Provider | EnvironmentProviders> =>
{
    return [
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: 'D',
                },
                display: {
                    dateInput         : 'DDD',
                    monthYearLabel    : 'LLL yyyy',
                    dateA11yLabel     : 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },
    ];
};
