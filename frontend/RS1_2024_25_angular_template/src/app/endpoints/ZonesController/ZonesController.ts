import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';

import {MyConfig} from '../../my-config';

export interface Zone {
  id?: number;
  name: string;
  localeId: number;
  xCoordinate: number;
  yCoordinate: number;
  width: number;
  height: number;
}
export interface ZoneDTO {
  id: number;
  name: string;
  height: number;
  width: number;
  xCoordinate: number;
  yCoordinate: number;
}


export interface ZoneLayoutDTO{
  localeId: number;
  zones: ZoneDTO[];
}



@Injectable({
  providedIn: 'root'
})


export class ZoneService {

  apiUrl =`${MyConfig.api_address}/Zones`;

  constructor(
    private http: HttpClient) {}

  getZone(localeId: number): Observable<ZoneDTO[]> {
    return this.http.get<ZoneDTO[]>(`${this.apiUrl}/GetZone/${localeId}`);
  }

  deleteZone(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteZone/${id}`);
  }
  saveTableLayout(request: ZoneLayoutDTO): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/SaveZoneLayout`, request).pipe(
      map((response) => {
        console.log('Save Zone Layout Response:', response); // Log the response to confirm
        return response; // Return the response object
      })
    );
  }
}

