import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SettingsComponent } from './settings/settings.component';
import {SharedModule} from '../shared/shared.module';
import { EditProfileComponent } from './settings/edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    SettingsComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
