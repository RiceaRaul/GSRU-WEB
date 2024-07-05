import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
  standalone: true,
})
export class KeysPipe implements PipeTransform {

  transform(value: unknown): string[] {
    return Object.keys(value);
  }

}
