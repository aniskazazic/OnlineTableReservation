import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';
import { Observable } from 'rxjs';

export interface CountryGetByIdResponse {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CountryGetByIdEndpointService {
  private apiUrl = `${MyConfig.api_address}/countries`; // npr. http://localhost:7000/countries

  constructor(private http: HttpClient) {}

  handleAsync(id: number): Observable<CountryGetByIdResponse> {
    return this.http.get<CountryGetByIdResponse>(`${this.apiUrl}/getbyid/${id}`);
  }
}
