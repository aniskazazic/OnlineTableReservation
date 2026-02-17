import {Component, OnInit} from '@angular/core';
import {
  Reservation,
  ReservationDetailsDTO,
  ReservationService
} from '../../../endpoints/reservations-controllers/reservation-controller';
import {ZoneDTO} from '../../../endpoints/ZonesController/ZonesController';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.css'
})
export class UserReservationsComponent implements OnInit {

  reservations:ReservationDetailsDTO[]=[];
  pastReservations:ReservationDetailsDTO[]=[];
  activeTab: 'active' | 'past' = 'active'; // track tab state


  constructor(private reservationService: ReservationService) {
  }

  ngOnInit() {
    this.loadReservations()
  }


  switchTab(tab: 'active' | 'past'): void {
    this.activeTab = tab;

    if (tab === 'active') {
      this.loadReservations();
    } else {
      this.loadPastReservations();
    }
  }


  loadReservations(){
    this.reservationService.getUserReservations().subscribe({
      next: (z: ReservationDetailsDTO[]) => {
        this.reservations=z;
      }
    })
  }

  loadPastReservations(){
    this.reservationService.getPastUserReservations().subscribe({
      next: (z: ReservationDetailsDTO[]) => {
        this.reservations=z;
      }
    })
  }

  cancelReservation(id:number){


    this.reservationService.cancelReservation(id).subscribe({

      }
    )
    this.loadReservations();

  }

}
