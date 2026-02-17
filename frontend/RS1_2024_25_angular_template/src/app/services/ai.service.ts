import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:7000/api/Ai/ask';

  constructor(private http: HttpClient) {}

  ask(prompt: string): Observable<{ responseText: string }> {
    return this.http.post<{ responseText: string }>(this.apiUrl, { prompt });
  }
}
