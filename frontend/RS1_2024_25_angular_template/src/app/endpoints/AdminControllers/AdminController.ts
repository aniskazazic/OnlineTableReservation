import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {MyConfig} from '../../my-config';
import {MyPagedRequest} from '../../helper/my-paged-request';
import {MyPagedList} from '../reviews-endpoints/reviews-endpoints';
import {buildHttpParams} from '../../helper/http-params.helper';
import {GetAllUsersResponse} from '../user-endpoints/get-user-endpoint';
import {CityGetByIdResponse} from '../city-endpoints/city-get-by-id-endpoint.service';

export interface DashboardStats {
  countOfUsers: number;
  countOfDeletedUsers: number;
  countOfActiveUsers: number;
  countOfLocales: number;
}
export interface AnalyticsDto {
  userStatsData: number[];       // [active, deleted]
  userRoleData: number[];        // [owner, worker, normal]
  localeCategoryData: number[];  // [coffee, club, restaurant]
  localeCountyData: number[];    // [count1, count2, count3]
  countyNames: string[];         // ['Croatia', 'Germany', 'France']
}

export interface GetLocaleAdminResponse {
  id: number;
  localeName: string;
  city: string;
  country: string;
  address: string;
  category: string;
  isDeleted: boolean;

  categoryId:number;
  cityId :number;
  countryId:number;

}

export interface GetLocaleAdminRequest extends MyPagedRequest{
  search?: string;
  showDeleted: boolean;
}

export interface UpdateLocaleRequest {
  id: number;
  localeName: string;
  countryId: number;
  cityId: number;
  address: string;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminController {
  apiUrl =`${MyConfig.api_address}`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/AdminControllers/GetStats`);
  }

  getAnalytics(): Observable<AnalyticsDto> {
    return this.http.get<AnalyticsDto>(`${this.apiUrl}/AdminControllers/GetAnalytics`);
  }

  getLocales(request:GetLocaleAdminRequest): Observable<MyPagedList<GetLocaleAdminResponse>> {

    const params = buildHttpParams(request); // Use the helper function here

    return this.http.get<MyPagedList<GetLocaleAdminResponse>>(`${this.apiUrl}/AdminLocaleControllers/GetAllLocale`, { params }).pipe(
      map((response) => response) // Extract the `dataItems` array
    );
  }

  updateLocale(request: UpdateLocaleRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/AdminControllers/UpdateLocale`, request);
  }


  reactiveLocale(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/AdminLocaleControllers/ReactiveLocale?id=${id}`, {});
  }


  getCityById(id:number){
    return this.http.get<CityGetByIdResponse>(`${this.apiUrl}/AdminControllers/GetById?id=${id}`);
  }


}
