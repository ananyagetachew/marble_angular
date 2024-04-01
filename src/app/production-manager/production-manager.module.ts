import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionManagerRoutingModule } from './production-manager-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ProductionManagerRoutingModule,
    SharedModule,
    PipeModule
  ],
  exports: [DashboardComponent],
  declarations: [DashboardComponent]
})
export class ProductionManagerModule { }
