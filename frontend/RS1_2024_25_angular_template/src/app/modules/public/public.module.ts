import {NgModule} from '@angular/core';
import { NgClass } from '@angular/common';
import {CommonModule} from '@angular/common';
import {PublicRoutingModule} from './public-routing.module';
import {HomeComponent} from './home/home.component';
import {PublicLayoutComponent} from './public-layout/public-layout.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {LocaleGetByCategoryComponent} from '../../endpoints/locale-get-by-category/locale-get-by-category.component';
import { LoadLocaleComponent } from './load-locale/load-locale.component';
import { UpdateLocaleComponent } from './update-locale/update-locale.component';
import {TranslatePipe} from "@ngx-translate/core";
import { TableLayoutComponent } from './table-layout/table-layout.component';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ReservationComponentComponent } from './reservation-component/reservation-component.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { UserReservationsComponent } from './user-reservations/user-reservations.component';
import {MatFormField} from "@angular/material/form-field";
import { LocaleSearchComponent } from './locale-search/locale-search.component';
import { OwnerVerifyComponent } from './owner-verify/owner-verify.component';

@NgModule({
  declarations: [
    HomeComponent,
    PublicLayoutComponent,
    LoadLocaleComponent,
    UpdateLocaleComponent,
    TableLayoutComponent,
    ReservationComponentComponent,
    FavouritesComponent,
    UserReservationsComponent,
    LocaleSearchComponent,
    OwnerVerifyComponent,
  ],
    imports: [
        CommonModule,
        PublicRoutingModule,
        FormsModule,
        SharedModule,
        TranslatePipe,
        CdkDrag,
        DragDropModule,
        MatFormField
    ],



})
export class PublicModule {
}
