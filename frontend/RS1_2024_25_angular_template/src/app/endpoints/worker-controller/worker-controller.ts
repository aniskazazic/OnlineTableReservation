import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MyPagedList} from '../reviews-endpoints/reviews-endpoints';
import {buildHttpParams} from '../../helper/http-params.helper';
import {MyPagedRequest} from '../../helper/my-paged-request';

export interface WorkerRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  hireDate: Date;
  localeId: number;
}

export interface WorkerUpdateRequest {
  id:number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  hireDate: Date;
}

export interface WorkerRequest{
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password:string;
  phoneNumber: string;
  hireDate: Date;
  birthDate: Date;
  localeId:number
}

export interface WorkerGetResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  hireDate: Date;
  endDate: Date | null;
}

export interface WorkerGetRequest extends MyPagedRequest{
  q?: string;
}

export interface WorkerUpdateOrInsertRequest {
  id?: number;

  // Zajedničko
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password?: string;
  hireDate?: Date; // ISO format npr. '2025-08-01'

  // Samo za insert
  localeId?: number;
  birthDate?: Date;
}

export interface WorkerGetByIdResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password?: string; // može biti opcionalno jer se obično ne šalje nazad na frontend
  birthDate: Date; // koristi string jer se Date obično serijalizira kao ISO string
  hireDate: Date;
  localeId: number;
}


@Injectable({
  providedIn: 'root',
})
export class WorkerController {
  private readonly baseUrl = 'http://localhost:7000/Worker';

  constructor(private http: HttpClient) {}

  addWorker(request: WorkerRequest): Observable<WorkerRequest> {
    return this.http.post<WorkerRequest>(`${this.baseUrl}/AddWorker`, request);
  }

  getAllWorkers(request: WorkerGetRequest): Observable<MyPagedList<WorkerGetResponse>> {
   const params = buildHttpParams(request);
    return this.http.get<MyPagedList<WorkerGetResponse>>(`${this.baseUrl}/GetAllWorkers`, { params });
  }

  updateWorker(id: number, request: WorkerUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/UpdateWorker/${id}`, request);
  }

  deleteWorker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteWorker/${id}`);
  }

  updateOrInsertWorker(worker: WorkerUpdateOrInsertRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/WorkerUpdateOrInsert`, worker);
  }

  getWorkerById(id: number): Observable<WorkerGetByIdResponse> {
    return this.http.get<WorkerGetByIdResponse>(`${this.baseUrl}/GetWorkerById/${id}`);
  }

  getMyLocale() {
    return this.http.get(`${this.baseUrl}/LocaleGetByWorkerId`);
  }

}
