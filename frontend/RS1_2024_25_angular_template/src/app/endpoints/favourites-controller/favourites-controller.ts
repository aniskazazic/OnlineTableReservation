import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyAuthService } from '../../services/auth-services/my-auth.service';


export interface FavouriteDTO {
  id: number;
  localeId: number;
  localeName: string;
  localeAddress: string;
  localeLogo: string;
  startOfWorkingHours: string;
  endOfWorkingHours: string;
}

@Injectable({
  providedIn: 'root',
})

export class FavouriteService {
  private baseUrl = 'http://localhost:7000/Favourites';

  constructor(private http: HttpClient, private authService: MyAuthService) {}

  addToFavourites(localeId: number): Observable<any> {
    const userId = <number>this.authService.getMyAuthInfo()?.personID;
    return this.http.post(`${this.baseUrl}/AddToFavourites/add`, null, {
      params: {
        userId,
        localeId,
      },
      responseType: 'text' as 'json',
    });
  }

  removeFromFavourites(localeId: number): Observable<any> {
    const userId = <number>this.authService.getMyAuthInfo()?.personID;
    return this.http.delete(`${this.baseUrl}/RemoveFromFavourites/remove`, {
      params: {
        userId,
        localeId,
      },
      responseType: 'text' as 'json',
    });
  }

  isFavourited(localeId: number): Observable<boolean> {
    const userId = <number>this.authService.getMyAuthInfo()?.personID;
    return this.http.get<boolean>(`${this.baseUrl}/IsFavourited/is-favourited`, {
      params: {
        userId,
        localeId,
      },
    });
  }

  getUserFavourites(): Observable<FavouriteDTO[]> {
    const userId = <number>this.authService.getMyAuthInfo()?.personID;
    return this.http.get<FavouriteDTO[]>(`${this.baseUrl}/GetFavouritesByUser/user/${userId}`);
  }
}
