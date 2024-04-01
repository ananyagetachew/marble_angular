import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceManagerRoutingModule } from './finance-manager-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FinanceManagerRoutingModule,
    SharedModule,
    NgZorroAntdModule,
    FormsModule,
    PipeModule
  ],
  declarations: [DashboardComponent]
})
export class FinanceManagerModule { }
