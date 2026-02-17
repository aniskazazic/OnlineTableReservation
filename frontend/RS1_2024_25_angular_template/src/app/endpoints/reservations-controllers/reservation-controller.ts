import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MyAuthService} from '../../services/auth-services/my-auth.service';


export interface CreateReservationDto {
  userId: number;
  tableId: number;
  reservationDate: string; // format: 'YYYY-MM-DD'
  startTime: string; // format: 'HH:mm'
  endTime: string;   // format: 'HH:mm'
}

export interface Reservation {
  id: number;
  userId: number;
  tableId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface TimeSlotDto {
  start: string; // 'HH:mm'
  end: string;   // 'HH:mm'
}

export interface ReservationDetailsDTO {
  id: number;
  tableName: string;
  numberOfGuests: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  localeId: number;
  localeName: string;
  localeAdress: string;
  localeLogo: string;
}



@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly apiUrl = 'http://localhost:7000/Reservation/';

  constructor(private http: HttpClient, private authService:MyAuthService) {}

  createReservation(dto: CreateReservationDto): Observable<Reservation> {
    return this.http.post<Reservation>('http://localhost:7000/Reservation/CreateReservation', dto);
  }

  getAvailableSlots(tableId: number, date: string): Observable<TimeSlotDto[]> {
    const params = new HttpParams()
      .set('tableId', tableId.toString())
      .set('date', date);

    return this.http.get<TimeSlotDto[]>(`${this.apiUrl}GetAvailableSlots/slots`, { params });
  }

  getUserReservations(): Observable<ReservationDetailsDTO[]> {
    const userId=<number>this.authService.getMyAuthInfo()?.personID;
    return this.http.get<ReservationDetailsDTO[]>(`${this.apiUrl}GetUserReservations/by-user/${userId}`);
  }

  getPastUserReservations(): Observable<ReservationDetailsDTO[]> {
    const userId=<number>this.authService.getMyAuthInfo()?.personID;
    return this.http.get<ReservationDetailsDTO[]>(`${this.apiUrl}GetPastUserReservations/by-user/${userId}`);
  }


  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}CancelReservation/${id}`);
  }
}
