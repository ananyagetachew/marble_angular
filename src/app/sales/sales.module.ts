import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProformasComponent } from './proformas/proformas.component';
import { NgZorroAntdModule, } from 'ng-zorro-antd';
import { PipeModule } from '../pipe/pipe.module';
import { RouterModule } from '@angular/router';
import { ProductionsComponent } from './productions/productions.component';
import { ProductionComponent } from './production/production.component';
import { SharedModule } from '../shared/shared.module';
import { ProformaDetailComponent } from './proforma-detail/proforma-detail.component';
import { SalesRoutingModule } from './sales-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SalesRoutingModule,
    CommonModule,
    PipeModule,
    RouterModule,
    FormsModule,
    SharedModule,
    NgZorroAntdModule
  ],
  exports: [
    DashboardComponent,
    ProformasComponent,
    ProductionsComponent,
    ProformaDetailComponent
  ],
  declarations: [
    DashboardComponent,
    ProformasComponent,
    ProductionsComponent,
    ProductionComponent,
    ProformaDetailComponent
  ]
})
export class SalesModule {
}
