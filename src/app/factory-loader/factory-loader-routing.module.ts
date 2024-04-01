import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FactoryOrderDetailComponent } from './factory-order-detail/factory-order-detail.component';
import { AuthGuard } from '../helpers/authguard';
import { FactoryLoaderDetailResolver } from './factory-order-detail/factory-order-detail-resolver';
import { DeliveredsComponent } from '../shared/delivereds/delivereds.component';
import { DeliveredDetailComponent } from '../shared/delivered-detail/delivered-detail.component';
import { DeliveredDetailResolver } from '../shared/delivered-detail/delivered-detail-resolver';
import { FilterableItemListComponent } from '../shared/filterable-item-list/filterable-item-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'production/:id',
    component: FactoryOrderDetailComponent, canActivate: [AuthGuard], resolve: { order: FactoryLoaderDetailResolver }
  },
  { path: 'delivereds', component: DeliveredsComponent, canActivate: [AuthGuard] },
  {
    path: 'delivered/:id',
    component: DeliveredDetailComponent, canActivate: [AuthGuard], resolve: { order: DeliveredDetailResolver }
  },
  {
    path: 'filter',
    component: FilterableItemListComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoryLoaderRoutingModule { }
