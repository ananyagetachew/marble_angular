import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/authguard';
import { ProductionResolver } from './sales/production/production-resolver';
import { DeliveryDetailResolver } from './shared/order-detail-table/delivery-detail-resolver';
import { ProformaDetailResolver } from './shared/order-detail-table/proforma-detail-resolver';
import { FactoryLoaderDetailResolver } from './factory-loader/factory-order-detail/factory-order-detail-resolver';
import { DeliveredDetailResolver } from './shared/delivered-detail/delivered-detail-resolver';

const routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'sales',
    loadChildren: './sales/sales.module#SalesModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'factoryloader',
    loadChildren: './factory-loader/factory-loader.module#FactoryLoaderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'stockmanager',
    loadChildren: './stock-manager/stock-manager.module#StockManagerModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'productionmanager',
    loadChildren: './production-manager/production-manager.module#ProductionManagerModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'financemanager',
    loadChildren: './finance-manager/finance-manager.module#FinanceManagerModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    DeliveryDetailResolver,
    ProformaDetailResolver,
    ProductionResolver,
    FactoryLoaderDetailResolver,
    DeliveredDetailResolver
  ]
})
export class AppRoutingModule { }
