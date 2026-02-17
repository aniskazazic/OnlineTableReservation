import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {debounceTime, distinctUntilChanged, Observable, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import {MyAuthService} from '../../services/auth-services/my-auth.service';

export interface LocaleDetails {
  id: number;
  name: string;
  cityName: string;
  description: string;
  logo: string;
  startOfWorkingHours: string;
  endOfWorkingHours: string;
  ownerName: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface LocaleRequest {
  name: string;
  logo: string | null; // `logo` može biti null
  startOfWorkingHours: { hour: number; minute: number };
  endOfWorkingHours: { hour: number; minute: number };
  cityId: number; // Mora biti broj, bez `null`
  categoryId: number; // Mora biti broj, bez `null`
  ownerId: number;
  IsDeleted: boolean;
  DeleteAt: Date | null;
  address: string;
  lengthOfReservation: number;

}
export interface LocaleUpdateRequest {
  id: number;
  name?: string;
  startOfWorkingHours?: { hour: number; minute: number };
  endOfWorkingHours?: { hour: number; minute: number };
  cityId?: number;
  categoryId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocaleService implements MyBaseEndpointAsync<LocaleRequest> {
  private baseUrl = 'http://localhost:7000';
  private postApiUrl = `${this.baseUrl}/Locale/LocalePost`;
  private updateApiUrl = `${this.baseUrl}/Locale/localeupdate`;
  constructor(private http: HttpClient, private authService: MyAuthService) {}

  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cities/all`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories/all`);
  }

  uploadLogo(localeId: number, base64Logo: string): Observable<void> {
    const payload = {
      localeId: localeId,
      logo: base64Logo,
    };
    return this.http.post<void>(`${this.baseUrl}/LocaleLogo`, payload);
  }

  createCheckoutSession(localeRequest: LocaleRequest) {
    return this.http.post<any>('http://localhost:7000/Locale/CreateCheckoutSession', localeRequest);
  }


  // locale.service.ts
  saveLocale(body: any) {
    return this.http.post('http://localhost:7000/Locale/Save', body);
  }




  handleAsync(request: LocaleRequest): Observable<void> {
    return this.http
      .post<void>(`${this.postApiUrl}`, request)
      .pipe(
        tap(() => {
          console.log('Locale added');
        })
      );
  }



  deleteLocale(id: number) : Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/locales/${id}`);
  }


  updateAsync(request: LocaleUpdateRequest): Observable<void> {
    return this.http
      .post<void>(this.updateApiUrl, request)
      .pipe(
        tap(() => {
          console.log('Locale updated successfully');
        })
      );
  }
  getLocaleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Locale/${id}`);
  }


  getLocaleDetailsById(localeId: number): Observable<LocaleDetails> {
    return this.http.get<LocaleDetails>(`${this.baseUrl}/LocaleGet?request=${localeId}`);
  }


}
