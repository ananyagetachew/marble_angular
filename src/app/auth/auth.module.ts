import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    LoginComponent,
  ],
  declarations: [LoginComponent]
})
export class AuthModule { }
