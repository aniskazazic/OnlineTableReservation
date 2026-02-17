import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {MyConfig} from '../../my-config';
import {MyPagedRequest} from '../../helper/my-paged-request';
import {MyPagedList} from '../reviews-endpoints/reviews-endpoints';
import {buildHttpParams} from '../../helper/http-params.helper';
import {GetAllUsersResponse} from '../user-endpoints/get-user-endpoint';
import {CountryGetAllResponse} from '../country-endpoints/country-get-all-endpoint.service';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';



export interface CategoryGetAllResponse
{
  id:number,
  name: string,
  description: string,
}


@Injectable({
  providedIn: 'root'
})
export class CategoryGetAllEndpoint implements MyBaseEndpointAsync<void, CategoryGetAllResponse[]>  {
  apiUrl =`${MyConfig.api_address}/categories/all`;

  constructor(private http: HttpClient) {

  }

  handleAsync() {
    return this.http.get<CategoryGetAllResponse[]>(this.apiUrl);
  }


}
