import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyAuthService } from '../../services/auth-services/my-auth.service';
import { MyPagedRequest } from '../../helper/my-paged-request';
import { MyPagedList } from '../reviews-endpoints/reviews-endpoints';
import { buildHttpParams } from '../../helper/http-params.helper';

export interface ReservationGetResponse {
  id: number;
  firstName: string;
  lastName: string;
  reservationDate: string;
  startTime: string;
  guests: number;
  tableName: string;
}

export interface ReservationGetRequest extends MyPagedRequest {
  q?: string;
  showDeleted: boolean;
  date?: string;
}

export interface OwnerMeResponse {
  id: number;
  phoneNumber?: string | null;
  isVerified: boolean; // backend vraća owner.IsVerified == true (null -> false)
}

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private baseUrl = 'http://localhost:7000/Owner';

  constructor(private http: HttpClient, private authService: MyAuthService) {}

  // ===== NEW: 2FA helper endpoints =====
  me(): Observable<OwnerMeResponse> {
    return this.http.get<OwnerMeResponse>(`${this.baseUrl}/Me`);
  }

  startPhoneVerification(): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.baseUrl}/StartPhoneVerification`, {});
  }

  confirmPhoneVerification(code: string): Observable<{ verified: boolean; reason?: string }> {
    return this.http.post<{ verified: boolean; reason?: string }>(`${this.baseUrl}/ConfirmPhoneVerification`, { code });
  }
  // =====================================

  getTodaysReservations(localeId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/GetTodaysReservations`, {
      params: new HttpParams().set('localeId', localeId.toString())
    });
  }

  getTodaysGuests(localeId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/GetTodaysGuests`, {
      params: new HttpParams().set('localeId', localeId.toString())
    });
  }

  getActiveTables(localeId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/GetActiveTables`, {
      params: new HttpParams().set('localeId', localeId.toString())
    });
  }

  getMyLocale(localeId: number) {
    return this.http.get(`${this.baseUrl}/GetMyLocale`, {
      params: new HttpParams().set('localeId', localeId.toString())
    });
  }

  getTotalTables(localeId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/GetTotalTables`, {
      params: new HttpParams().set('localeId', localeId.toString())
    });
  }

  getTableDistribution(localeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetTableDistribution`, {
      params: new HttpParams().set('localeId', localeId.toString())
    });
  }

  getAllReservations(request: ReservationGetRequest): Observable<MyPagedList<ReservationGetResponse>> {
    const params = buildHttpParams(request);
    return this.http.get<MyPagedList<ReservationGetResponse>>(`${this.baseUrl}/GetAllReservations`, { params });
  }

  getOwnerId(userId: number): Observable<number> {
    // ostavljam tvoj originalni neobični path, jer tako backend trenutno radi
    return this.http.get<number>(`${this.baseUrl}/GetOwnerId/getOwnerId/${userId}`);
  }
}
