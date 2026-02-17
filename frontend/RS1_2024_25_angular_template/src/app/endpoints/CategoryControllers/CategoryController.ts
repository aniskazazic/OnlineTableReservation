import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})


export class CategoryService {
  private baseUrl = 'http://localhost:7000/Category';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/GetAll`);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/GetById/${id}`);
  }

  create(category: Category): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create`, category);
  }

  update(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.baseUrl}/Update/${id}`, category);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Delete/${id}`);
  }
}
