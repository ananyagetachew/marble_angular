import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule, } from 'ng-zorro-antd';
import { PipeModule } from '../pipe/pipe.module';
import { OrderDetailTableComponent } from './order-detail-table/order-detail-table.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FilterableItemListComponent } from './filterable-item-list/filterable-item-list.component';
import { ReportComponent } from './report/report.component';
import { StockAggregateComponent } from './stock-aggregate/stock-aggregate.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { DeliveredsComponent } from "./delivereds/delivereds.component";
import { DeliveredDetailComponent } from "./delivered-detail/delivered-detail.component";

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    PipeModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  exports: [OrderDetailTableComponent, NavbarComponent, FilterableItemListComponent,
    ReportComponent, StockAggregateComponent, DeliveriesComponent, DeliveryDetailComponent,
    DeliveredsComponent, DeliveredDetailComponent],
  declarations: [OrderDetailTableComponent, NavbarComponent, FilterableItemListComponent,
    ReportComponent, StockAggregateComponent, DeliveriesComponent, DeliveryDetailComponent,
    DeliveredsComponent, DeliveredDetailComponent]
})
export class SharedModule {
}
