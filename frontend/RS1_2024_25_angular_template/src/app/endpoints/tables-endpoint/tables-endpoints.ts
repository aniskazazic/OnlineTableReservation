import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyPagedRequest} from '../../helper/my-paged-request';
import {MyConfig} from '../../my-config';
import {GetAllUsersResponse} from '../user-endpoints/get-user-endpoint';
import {HttpClient} from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import {map, Observable, of, throwError} from 'rxjs';
import {buildHttpParams} from '../../helper/http-params.helper';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';


export interface TableGetRequest {
  localeId: number; // This field is required
}

export interface TableGetResponse {
  id: number;
  name: string;
  xCoordinate: number;
  yCoordinate: number;
  numberOfGuests:number;
}
export interface SaveTableLayoutRequest {
  localeId: number;
  tables: TableGetResponse[];
}

@Injectable({
  providedIn: 'root',
})

export class TableService implements MyBaseEndpointAsync<TableGetRequest,TableGetResponse[]> {
  private apiUrl = `${MyConfig.api_address}/Table`;


  constructor(private httpClient: HttpClient, private router: Router) {}

  // Fetch paginated list of users
  handleAsync(request: TableGetRequest): Observable<TableGetResponse[]> {
    const params = buildHttpParams(request);

    return this.httpClient.get<TableGetResponse[]>(`http://localhost:7000/Table/GetByLocale`, { params }).pipe(
      map((response) => {
        console.log('API Response:', response);
        return response;
      }),
      catchError((error) => {
        if (error.status === 403) {
          console.log("ovo je error -> ", error);
          this.router.navigate(['/public/home']); // Redirekcija na home page
        }
        return throwError(() => error); // Propagiranje greške dalje ako treba
      })
    );
  }

  checkIfOwner(id: number) {
    this.httpClient.get<void>(`http://localhost:7000/Owner/CheckIfOwner?localeId=${id}`)
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            console.log("ovo je error -> ", error);
            this.router.navigate(['/public/home']); // Redirekcija na home page
          }
          return throwError(() => error); // Propagiranje greške dalje ako treba
        })
      )
      .subscribe({
        next: () => {
          console.log("Korisnik je vlasnik.");
        },
        error: (err) => {
          console.log("Greška prilikom provjere vlasništva:", err);
        }
      });
    return true;
  }

  checkIfOwnerOrWorker(id: number) {
    this.httpClient.get<void>(`http://localhost:7000/Owner/CheckIfOwnerOrWorker?localeId=${id}`)
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            console.log("ovo je error -> ", error);
            this.router.navigate(['/public/home']); // Redirekcija na home page
          }
          return throwError(() => error); // Propagiranje greške dalje ako treba
        })
      )
      .subscribe({
        next: () => {
          console.log("Korisnik je vlasnik.");
        },
        error: (err) => {
          console.log("Greška prilikom provjere vlasništva:", err);
        }
      });
    return true;
  }

  checkIfOwner2(id: number): Observable<boolean> {
    return this.httpClient
      .get<boolean>(`http://localhost:7000/Owner/CheckIfOwner?localeId=${id}`)
      .pipe(
        map((response) => {
          // Backend vraća "false" ako nije vlasnik, a prazan body (null) ako jeste
          if (response === false) {
            return false;
          }
          return true;
        }),
        catchError((error) => {
          console.error("Greška prilikom provjere vlasništva:", error);
          return of(false);
        })
      );
  }





  saveTableLayout(request: SaveTableLayoutRequest): Observable<{ message: string }> {
    const url = 'http://localhost:7000/Table/SaveTaleLayout'; // Update the endpoint URL as needed

    return this.httpClient.post<{ message: string }>(url, request).pipe(
      map((response) => {
        console.log('Save Table Layout Response:', response); // Log the response to confirm
        return response; // Return the response object
      })
    );
  }
}
