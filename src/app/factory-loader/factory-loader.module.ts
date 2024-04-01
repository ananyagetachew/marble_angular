import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FactoryLoaderRoutingModule } from './factory-loader-routing.module';
import { PipeModule } from '../pipe/pipe.module';
import { FactoryOrderDetailComponent } from './factory-order-detail/factory-order-detail.component';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from "ng-zorro-antd";

@NgModule({
  imports: [
    FactoryLoaderRoutingModule,
    NgZorroAntdModule,
    PipeModule,
    SharedModule,
    CommonModule
  ],
  exports: [DashboardComponent],
  declarations: [
    DashboardComponent,
    FactoryOrderDetailComponent
  ]
})
export class FactoryLoaderModule {
}
