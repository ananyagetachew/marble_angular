import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockManagerRoutingModule } from './stock-manager-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import { NgZorroAntdModule, } from 'ng-zorro-antd';
import { SharedModule } from '../shared/shared.module';
import { PipeModule } from '../pipe/pipe.module';
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    StockManagerRoutingModule,
    SharedModule,
    PipeModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [DashboardComponent],
  declarations: [DashboardComponent, StockComponent]
})
export class StockManagerModule {
}
