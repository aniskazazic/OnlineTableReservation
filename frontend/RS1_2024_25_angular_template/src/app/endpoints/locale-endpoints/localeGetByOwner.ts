import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface LocaleGetByOwnerResponse {
  localeId: number;
  name: string;
  // Ako kasnije uključiš logo (base64 string), možeš dodati:
  logo: string;
}


@Injectable({
  providedIn: 'root'
})
export class LocaleGetByOwnerService {
  private apiUrl = 'http://localhost:7000/LocaleGetByOwner?request='; // Promijeni ako koristiš drugi port ili domen

  constructor(private http: HttpClient) {}


  getLocalesByOwner(ownerId: number): Observable<LocaleGetByOwnerResponse[]> {

    return this.http.get<LocaleGetByOwnerResponse[]>(this.apiUrl+ownerId);
  }
}
