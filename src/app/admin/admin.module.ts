import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, PipeModule, NgZorroAntdModule],
  declarations: [DashboardComponent, StockTransferComponent],
  exports: [DashboardComponent]
})
export class AdminModule {
}
