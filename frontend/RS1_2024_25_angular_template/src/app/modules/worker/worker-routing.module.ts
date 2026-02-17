import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReservationsComponent} from './reservations/reservations.component';
import {WorkerWelcomeComponent} from './worker-welcome/worker-welcome.component';

const routes: Routes = [
  {path: 'welcome', component: WorkerWelcomeComponent},
  {path:'reservations', component: ReservationsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerRoutingModule { }
