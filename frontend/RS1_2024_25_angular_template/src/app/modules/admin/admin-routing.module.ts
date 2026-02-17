import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CitiesComponent} from './cities/cities.component';
import {CitiesEditComponent} from './cities/cities-edit/cities-edit.component';
import {AdminUserManagementComponent} from './admin-user-management/admin-user-management.component';
import {EditUserComponent} from './admin-user-management/edit-user/edit-user.component';

import {AdminSidebarComponent} from './admin-sidebar/admin-sidebar.component';
import {AdminAnalyticsComponent} from './admin-analytics/admin-analytics.component';
import {AdminLocaleManagementComponent} from './admin-locale-management/admin-locale-management.component';
import {AdminWelcomeComponent} from './admin-welcome/admin-welcome.component';
import {CategoryComponent} from './category/category.component';
import {CategoryEditComponent} from './category/category-edit/category-edit.component';
import {CountryNewComponent} from './country/country-new/country-new/country-new.component';
import {CountryEditComponent} from './country/country-edit/country-edit.component';
import {CountryComponent} from './country/country.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      {path: 'welcome', component: AdminWelcomeComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'analytics', component: AdminAnalyticsComponent},
      {path: 'cities', component: CitiesComponent},
      {path: 'cities/new', component: CitiesEditComponent},
      {path: 'cities/edit/:id', component: CitiesEditComponent},
      {path:'user',component:AdminUserManagementComponent },
      {path:'locale',component:AdminLocaleManagementComponent },
      { path: 'edit-user/:id', component: EditUserComponent },
      //{path: '**', component: AdminErrorPageComponent} // Default ruta
      { path: 'admin-sidebar', component: AdminSidebarComponent },
      { path: 'categories', component: CategoryComponent },
      { path: 'categories/edit/:id', component: CategoryEditComponent},
      { path: 'categories/new', component: CategoryEditComponent },
      {path:'countries', component: CountryComponent},
      {path:'country/new', component: CountryNewComponent},
      {path:'country/edit/:id', component: CountryEditComponent},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
