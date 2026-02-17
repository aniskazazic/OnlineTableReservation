import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LocaleImage {
    id: number;
    imageUrl: string;
    localeId: number;
}

export interface LocaleImageGetRequest {
    localeId: number;
}

export interface LocaleImagePostRequest {
    localeId: number;
    imageBase64: string;
}

export interface LocaleImageGetResponse {
    images: string[]; // Base64 strings
    contentType: string[];
    imageIds:number[];
}

@Injectable({
    providedIn: 'root'
})
export class LocaleImageService {
    private apiUrl = 'http://localhost:7000/LocaleImage';
  private getUrl = 'http://localhost:7000';

    constructor(private http: HttpClient) {}

    // Get all images for a locale
    getImages(request: LocaleImageGetRequest): Observable<LocaleImageGetResponse> {
        return this.http.get<LocaleImageGetResponse>(`${this.getUrl}/ImageGet`, {
            params: { localeId: request.localeId }
        });
    }

    // Upload new image
    addImage(request: LocaleImagePostRequest): Observable<void> {
        return this.http.post<void>(this.apiUrl, request);
    }

  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete/${id}`,{ responseType: 'text' });
  }
}
