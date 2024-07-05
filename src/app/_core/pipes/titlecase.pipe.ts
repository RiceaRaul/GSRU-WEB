import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTitlecase',
  standalone: true,
})
export class TitlecasePipe implements PipeTransform {
    replaceDictionary = {
        'clientDebtorRef':'clientDebtor',
        'idStareProcesare':'StareProcesare',
        'cif':'Client Debtor Ref'
    }

    transform(value: string): string {
        value = Object.prototype.hasOwnProperty.call(this.replaceDictionary, value)
            ? this.replaceDictionary[value].toString()
            : value;

        let replacedValue = '';
        const arr = value.replaceAll('_',' ').split('');
        arr[0] = arr[0].toUpperCase();

        arr.forEach((letter) => replacedValue = letter.toUpperCase() !== letter || Number(letter) ? replacedValue + letter : replacedValue + ' ' + letter);

        return replacedValue;
    }
}
