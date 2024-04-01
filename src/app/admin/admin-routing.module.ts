import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../helpers/authguard';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';

const routes: Routes = [
  { path: '', redirectTo: 'stock-transfer', pathMatch: 'full' },
  {
    path: 'stock-transfer',
    component: StockTransferComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
