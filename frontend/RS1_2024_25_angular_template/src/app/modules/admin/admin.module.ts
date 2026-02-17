import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {CitiesComponent} from './cities/cities.component';
import {CitiesEditComponent} from './cities/cities-edit/cities-edit.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { AdminUserManagementComponent } from './admin-user-management/admin-user-management.component';
import { EditUserComponent } from './admin-user-management/edit-user/edit-user.component';
import {RouterModule, Routes} from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';
import {NgChartsModule} from "ng2-charts";
import { AdminLocaleManagementComponent } from './admin-locale-management/admin-locale-management.component';
import { AdminWelcomeComponent } from './admin-welcome/admin-welcome.component';
import {TranslatePipe} from "@ngx-translate/core";
import { CategoryComponent } from './category/category.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';

import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableModule
} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard} from '@angular/material/card';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSlideToggle} from '@angular/material/slide-toggle';
import { CountryComponent } from './country/country.component';
import { CountryEditComponent } from './country/country-edit/country-edit.component';
import { CountryNewComponent } from './country/country-new/country-new/country-new.component';
const routes: Routes = [
  { path: '', component: AdminLayoutComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AdminLayoutComponent,
    CitiesComponent,
    CitiesEditComponent,
    AdminUserManagementComponent,
    EditUserComponent,

    AdminSidebarComponent,
    AdminAnalyticsComponent,
    AdminLocaleManagementComponent,
    AdminWelcomeComponent,
    CategoryComponent,
    CategoryEditComponent,
    CountryComponent,
    CountryEditComponent,
    CountryNewComponent,
  ],
  
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule, // Omogućava pristup svemu što je eksportovano iz SharedModule
            NgChartsModule,
TranslatePipe,
    MatButton,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatFormField,
    MatInput,
    MatIconModule,
    MatColumnDef,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatCard,
    MatProgressSpinner,
    MatSlideToggle,
  ],
  providers: []
})
export class AdminModule {
}
