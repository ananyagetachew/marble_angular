import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilterableItemListComponent } from '../shared/filterable-item-list/filterable-item-list.component';
import { ReportComponent } from '../shared/report/report.component';

const routes: Routes = [
  { path: '', redirectTo: 'filter', pathMatch: 'full' },
  {
    path: 'filter',
    component: FilterableItemListComponent
  },
  {
    path: 'report',
    component: ReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionManagerRoutingModule { }
