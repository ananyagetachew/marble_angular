import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPToProformaNoPipe } from './add--p--to-proforma-no.pipe';
import { AddDToDeliveryNoPipe } from './add--d--to-delivery-no.pipe';
import { AddPlusSymbolToNumbersPipe } from './add-plus-symbol-to-numbers.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AddPToProformaNoPipe, AddDToDeliveryNoPipe, AddPlusSymbolToNumbersPipe],
  exports: [AddPToProformaNoPipe, AddDToDeliveryNoPipe, AddPlusSymbolToNumbersPipe]
})
export class PipeModule { }
