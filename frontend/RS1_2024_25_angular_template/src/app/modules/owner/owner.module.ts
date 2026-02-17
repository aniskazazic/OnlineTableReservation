import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerRoutingModule } from './owner-routing.module';
import { OverviewComponent } from './overview/overview.component';
import {NgApexchartsModule} from "ng-apexcharts";
import { ReservationsComponent } from './reservations/reservations.component';
import {MatPaginator} from "@angular/material/paginator";
import {SharedModule} from "../shared/shared.module";
import { WorkersComponent } from './workers/workers.component';
import { WorkersEditComponent } from './workers/workers-edit/workers-edit.component';


@NgModule({
  declarations: [
    OverviewComponent,
    ReservationsComponent,
    WorkersComponent,
    WorkersEditComponent
  ],
    imports: [
        CommonModule,
        OwnerRoutingModule,
        NgApexchartsModule,
        MatPaginator,
        SharedModule
    ]
})
export class OwnerModule { }
