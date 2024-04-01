import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DeliveryDetailComponent} from '../shared/delivery-detail/delivery-detail.component';
import {AuthGuard} from '../helpers/authguard';
import {DeliveryDetailResolver} from '../shared/order-detail-table/delivery-detail-resolver';
import {DeliveriesComponent} from '../shared/deliveries/deliveries.component';
import {DeliveredsComponent} from '../shared/delivereds/delivereds.component';
import {DeliveredDetailComponent} from '../shared/delivered-detail/delivered-detail.component';
import {DeliveredDetailResolver} from '../shared/delivered-detail/delivered-detail-resolver';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deliveries',
    component: DeliveriesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery/:id',
    component: DeliveryDetailComponent, canActivate: [AuthGuard], resolve: { order: DeliveryDetailResolver }
  },
  {
    path: 'delivereds',
    component: DeliveredsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delivered/:id',
    component: DeliveredDetailComponent, canActivate: [AuthGuard], resolve: { order: DeliveredDetailResolver }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceManagerRoutingModule {
}
