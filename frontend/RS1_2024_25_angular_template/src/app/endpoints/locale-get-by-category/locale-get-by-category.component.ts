import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocaleGetResponse {
  LocaleId: number;
  Name: string;
  CityName: string;
  Logo: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocaleGetByCategoryComponent {

  private apiUrl = 'http://localhost:7000/LocaleGetCategory';  // Your backend API URL

  constructor(private http: HttpClient) { }

  getLocalesByCategory(categoryId: number): Observable<LocaleGetResponse[]> {
    const params = new HttpParams().set('CategoryId', categoryId.toString());
    return this.http.get<LocaleGetResponse[]>(this.apiUrl, { params });
  }
}
