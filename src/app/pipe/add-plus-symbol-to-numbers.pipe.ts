import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'addPlusSymbolToNumbers'
})
export class AddPlusSymbolToNumbersPipe implements PipeTransform {

  transform(value: any): any {
    return value > 0 ? `+${value}` : value;
  }

}
