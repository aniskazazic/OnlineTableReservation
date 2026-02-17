import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import{LoginRegisterPageComponent} from './login-register-page/login-register-page.component';
import {TranslatePipe} from "@ngx-translate/core";



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    AuthLayoutComponent,
    LoginRegisterPageComponent,
  ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslatePipe
    ]
})
export class AuthModule {
}
