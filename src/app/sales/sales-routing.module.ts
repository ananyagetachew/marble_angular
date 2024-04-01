import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProformasComponent } from './proformas/proformas.component';
import { ProformaDetailComponent } from './proforma-detail/proforma-detail.component';
import { AuthGuard } from '../helpers/authguard';
import { ProformaDetailResolver } from '../shared/order-detail-table/proforma-detail-resolver';
import { DeliveriesComponent } from '../shared/deliveries/deliveries.component';
import { DeliveryDetailComponent } from '../shared/delivery-detail/delivery-detail.component';
import { ProductionsComponent } from './productions/productions.component';
import { DeliveryDetailResolver } from '../shared/order-detail-table/delivery-detail-resolver';
import { ProductionResolver } from './production/production-resolver';
import { ProductionComponent } from './production/production.component';
import { FilterableItemListComponent } from '../shared/filterable-item-list/filterable-item-list.component';
import { ReportComponent } from '../shared/report/report.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  { path: 'proformas', component: ProformasComponent, canActivate: [AuthGuard] },
  {
    path: 'proforma/:id',
    component: ProformaDetailComponent, canActivate: [AuthGuard], resolve: { order: ProformaDetailResolver }
  },
  { path: 'deliveries', component: DeliveriesComponent, canActivate: [AuthGuard] },
  {
    path: 'delivery/:id',
    component: DeliveryDetailComponent, canActivate: [AuthGuard], resolve: { order: DeliveryDetailResolver }
  },

  { path: 'productions', component: ProductionsComponent, canActivate: [AuthGuard] },
  {
    path: 'production/:delivery_id',
    component: ProductionComponent, canActivate: [AuthGuard], resolve: { production: ProductionResolver }
  },
  {
    path: 'filter',
    component: FilterableItemListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'report',
    component: ReportComponent, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
