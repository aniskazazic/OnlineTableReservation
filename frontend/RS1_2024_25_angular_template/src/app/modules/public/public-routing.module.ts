import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PublicLayoutComponent} from './public-layout/public-layout.component';
import {HomeComponent} from './home/home.component';
import {LoadLocaleComponent} from './load-locale/load-locale.component';
import {ReservationComponentComponent} from './reservation-component/reservation-component.component';
import {TableLayoutComponent} from './table-layout/table-layout.component';
import {FavouritesComponent} from './favourites/favourites.component';
import {UserReservationsComponent} from './user-reservations/user-reservations.component';
import {UpdateLocaleComponent} from './update-locale/update-locale.component';
import {AddLocaleComponent} from '../add-locale/add-locale.component';
import {CountryNewComponent} from '../admin/country/country-new/country-new/country-new.component';
import {OwnerVerifyComponent} from './owner-verify/owner-verify.component';
import {OwnerOnlyGuard} from '../../auth-guards/owner-only.guard';
import {AuthGuard} from '../../auth-guards/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: PublicLayoutComponent, children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'favourites', component: FavouritesComponent},
      { path: 'locale/:id', component: LoadLocaleComponent },
      {path: 'reservations/:id', component: ReservationComponentComponent},
      {path: 'tablelayout/:id', component: TableLayoutComponent},
      {path:'user-reservations',component: UserReservationsComponent},
      {path: 'update-locale/:id', component: UpdateLocaleComponent},
      {path:'locale-edit/:id',component: UpdateLocaleComponent},
      {path:'owner-verify', component: OwnerVerifyComponent, canActivate: [OwnerOnlyGuard]},
      {path: '**', redirectTo: 'home', pathMatch: 'full'},  // Default ruta koja vodi na public

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
