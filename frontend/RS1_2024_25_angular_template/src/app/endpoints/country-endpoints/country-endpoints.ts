import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';
import { Observable } from 'rxjs';

export interface CountryUpdateOrInsertRequest {
  id?: number | null;   // optional (ili 0/null za insert)
  name: string;
}

export interface CountryUpdateOrInsertResponse {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryUpdateOrInsertEndpointService {
  private apiUrl = `${MyConfig.api_address}/countries`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: CountryUpdateOrInsertRequest): Observable<CountryUpdateOrInsertResponse> {
    return this.httpClient.post<CountryUpdateOrInsertResponse>(this.apiUrl, request);
  }
}
