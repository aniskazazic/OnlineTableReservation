import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsComponent } from './reservations/reservations.component';
import { WorkerWelcomeComponent } from './worker-welcome/worker-welcome.component';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {WorkerRoutingModule} from './worker-routing.module';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    ReservationsComponent,
    WorkerWelcomeComponent
  ],
  imports: [
    CommonModule,
    WorkerRoutingModule,
    FormsModule,
    TranslatePipe,
    SharedModule
  ]
})
export class WorkerModule { }
