import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UnauthorizedComponent} from './modules/shared/unauthorized/unauthorized.component';
import {AuthGuard} from './auth-guards/auth-guard.service';
import {RegisterComponent} from './modules/auth/register/register.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {LoginRegisterPageComponent} from './modules/auth/login-register-page/login-register-page.component';
import {SidebarComponent} from './modules/shared/sidebar/sidebar.component';
import {HomeComponent} from './modules/public/home/home.component';
import {LocaleGetByCategoryComponent} from './endpoints/locale-get-by-category/locale-get-by-category.component';
import {AddLocaleComponent} from './modules/add-locale/add-locale.component';
import {TableLayoutComponent} from './modules/public/table-layout/table-layout.component';
import {SuccessComponent} from './modules/success/success.component';
import {UpdateLocaleComponent} from './modules/public/update-locale/update-locale.component';
import {LocaleSearchComponent} from './modules/public/locale-search/locale-search.component';
import {CountryComponent} from './modules/admin/country/country.component';
import {CountryEditComponent} from './modules/admin/country/country-edit/country-edit.component';

const routes: Routes = [
  {path: 'unauthorized', component: UnauthorizedComponent},


  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {isAdmin: true}, // Proslijeđivanje potrebnih prava pristupa, ako je potrebno
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)  // Lazy load  modula
  },
  {
    path: 'public',
    loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule)  // Lazy load  modula
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)  // Lazy load  modula
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
    path:'owner',
    loadChildren: () => import('./modules/owner/owner.module').then(m => m.OwnerModule)
  },
  {
    path:'worker',
    loadChildren: () => import('./modules/worker/worker.module').then(m => m.WorkerModule)
  },
  //{path: '**', redirectTo: 'public', pathMatch: 'full'},  // Default ruta koja vodi na public

  {path: 'addlocale', component: AddLocaleComponent},
  {path: '', component: LoginRegisterPageComponent},
  {path: 'register',component:RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sidebar', component: SidebarComponent},
  {path: 'success', component : SuccessComponent},
  { path: 'update-locale/:id', component: UpdateLocaleComponent },
  {path:'locale-search', component: LocaleSearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
