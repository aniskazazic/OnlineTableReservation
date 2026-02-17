import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryDeleteEndpointService {
  private apiUrl = `${MyConfig.api_address}/countries`;

  constructor(private http: HttpClient) {}

  handleAsync(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
