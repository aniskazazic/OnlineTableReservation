import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { MyPagedRequest} from '../../helper/my-paged-request';
import {MyPagedList} from '../reviews-endpoints/reviews-endpoints';
import { MyConfig } from '../../my-config';
import { buildHttpParams } from '../../helper/http-params.helper';

export interface GetAllUsersResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isOwner: boolean;
  isWorker: boolean;
  isDeleted:boolean;
}

export interface UserReactivationRequest{
  id: number;
}

export interface GetAllDeletedUsersResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isOwner: boolean;
  isWorker: boolean;
  isDeleted: boolean;
  deletedAt: Date;
}

export interface GetUserByIdResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isOwner: boolean;
  isWorker: boolean;
  isDeleted: boolean;
}

export interface DeleteUserRequest {
  id: number;
}

export interface GetUserByIdRequest {
  id: number;
}


export interface UpdateUserRequest{
  id: number;
  userName:string
  email: string,
  firstName: string,
  lastName: string,
}

export interface UpdateUserProfileRequest{
  id: number;
  userName:string
  email: string,
  firstName: string,
  lastName: string,
}

export interface GetActiveUsersRequest extends MyPagedRequest{
  search?: string;
  showDeleted?:boolean;
}
export interface GetDeletedUsersRequest extends MyPagedRequest{
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService implements MyBaseEndpointAsync<MyPagedRequest, MyPagedList<GetAllUsersResponse>> {
  private apiUrl = `${MyConfig.api_address}/user`;

  constructor(private httpClient: HttpClient) {}

  // Fetch paginated list of users
  handleAsync(request: GetActiveUsersRequest): Observable<MyPagedList<GetAllUsersResponse>>{
    const params = buildHttpParams(request); // Use the helper function here

    return this.httpClient.get<MyPagedList<GetAllUsersResponse>>(`${this.apiUrl}/GetActiveUsers`, { params }).pipe(
      map((response) => response) // Extract the `dataItems` array
    );
  }

  getDeletedUsers(request: GetActiveUsersRequest):Observable<MyPagedList<GetAllDeletedUsersResponse>>{
    const params = buildHttpParams(request); // Use the helper function here

    return this.httpClient.get<{ dataItems: MyPagedList<GetAllDeletedUsersResponse> }>(`${this.apiUrl}/GetDeletedUsers`, { params }).pipe(
      map((response) => response.dataItems) // Extract the `dataItems` array
    );
  }

  // Disable a user
  disableUser(request: DeleteUserRequest): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.apiUrl}/DeleteUser`, request);
  }
  reactivateUser(request: UserReactivationRequest): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.apiUrl}/ReactivateUser`, request);
  }

  // Get a user by ID
  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse> {
    // Using POST since you are sending the data in the request body
    return this.httpClient.post<GetUserByIdResponse>(`${this.apiUrl}/GetUserById`, request);
  }

  // Update user details (assumes an update endpoint exists)
// Update the updateUser method to send UpdateUserRequest instead of GetUserByIdResponse
  updateUser(request: UpdateUserRequest): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.apiUrl}/UpdateUser`, request);
  }

  updateUserProfile(request: UpdateUserProfileRequest): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.apiUrl}/UpdateUserProfile`, request);

  }

  changePassword(request: { id: number; currentPassword: string; newPassword: string }) {
    return this.httpClient.post<any>(`${MyConfig.api_address}/userpassword/UpdateUserProfile`, request);
  }

}
