import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {ReservationsComponent} from './reservations/reservations.component';
import {WorkersComponent} from './workers/workers.component';
import {WorkersEditComponent} from './workers/workers-edit/workers-edit.component';

const routes: Routes = [

  {path:'overview/:id', component: OverviewComponent},
  {path:'reservations/:id', component: ReservationsComponent},
  {path:'workers/:id', component: WorkersComponent},
  {path:'worker/new/:localeId', component: WorkersEditComponent},
  {path: 'worker/edit/:workerId', component: WorkersEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
