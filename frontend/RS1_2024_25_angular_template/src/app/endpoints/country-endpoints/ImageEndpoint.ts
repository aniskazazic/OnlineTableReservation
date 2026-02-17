import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocaleImageService {
  private baseUrl = 'https://localhost:7000/LocaleImage'; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  uploadLocaleImage(localeId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('LocaleId', localeId.toString());
    formData.append('Image', imageFile);
    const request=new ImageRequest();
    request.LocaleId=localeId;
    request.Image=imageFile;

    return this.http.post<any>(`${this.baseUrl}`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
    });
  }
}

export class ImageRequest{
  LocaleId:number | null = null;
  Image: File | null = null;
}
