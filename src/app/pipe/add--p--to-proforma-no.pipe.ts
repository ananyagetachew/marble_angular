import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addPToProformaNo'
})
export class AddPToProformaNoPipe implements PipeTransform {

  transform(value: any): any {
    return 'p' + value;
  }

}
