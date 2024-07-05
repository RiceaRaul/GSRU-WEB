export enum PRINT_COMPONENTS {
    DEFAULT = 'DEFAULT',
    EXAMPLE_PRINT = 'EXAMPLE_PRINT',
}

export type PRINT_DATA<T> = {
    component : PRINT_COMPONENTS;
    data: T;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const DEFAULT_PRINT_DATA: PRINT_DATA<any> = { component : PRINT_COMPONENTS.DEFAULT, data: null}
/* eslint-enable @typescript-eslint/no-explicit-any */

