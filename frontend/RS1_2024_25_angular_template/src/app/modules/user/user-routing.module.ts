import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserModule} from './user.module';
import {SettingsComponent} from './settings/settings.component';
import {EditProfileComponent} from './settings/edit-profile/edit-profile.component';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'edit-profile', component: EditProfileComponent},

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
