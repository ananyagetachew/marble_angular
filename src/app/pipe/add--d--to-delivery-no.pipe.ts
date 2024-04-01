import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addDToDeliveryNo'
})
export class AddDToDeliveryNoPipe implements PipeTransform {

  transform(value: any): any {
    return 'd' + value;
  }

}
