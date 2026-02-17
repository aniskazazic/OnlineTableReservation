import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpClient
} from "@angular/common/http";
import { MyAuthService } from "./my-auth.service";
import { catchError, switchMap, throwError } from "rxjs";
import { Observable, of } from "rxjs";
import {LoginResponse} from '../../endpoints/auth-endpoints/auth-login-endpoint.service';
import {Router} from '@angular/router';

@Injectable()
export class MyAuthInterceptor implements HttpInterceptor {

  constructor(private auth: MyAuthService, private http: HttpClient,private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    const authToken: string | null = this.auth.getLoginToken();
    // Clone the request and add the authorization header.
    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {Authorization: `Bearer ${authToken}`}
      });
    }

    // Handle the request and check for 401 errors.
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token is invalid, attempt to refresh it.
          const refreshToken = this.auth.getRefreshToken();
          if (refreshToken) {
            return this.refreshToken(refreshToken).pipe(
              switchMap((response) => {
                console.log('Ovo je response',response);
                // Save the new tokens and retry the original request.
                this.auth.SetLoggedInUser(response);
                let retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${response.accessToken}` },
                });

                console.log('Retrying request:', retryReq);
                return next.handle(retryReq);
              }),
              catchError((err) => {
                console.error('Error during token refresh or retry:', err);
                return throwError(err);
              })
            );
          } else {
            // No refresh token available, log out the user.
            this.auth.logout();
            this.router.navigateByUrl('/login');
            return throwError(error);

          }
        }
        return throwError(error); // Propagate other errors.
      })
    );
  }

  refreshToken(refreshToken: string): Observable<RefreshResponse> {
    // Create the request object
    const request: RefreshRequest = {
      RefreshToken: refreshToken
    };

    // Send the request
    return this.http.post<RefreshResponse>('http://localhost:7000/Refresh', request);
  }
}

  export interface RefreshRequest {
  RefreshToken: string;
}
export interface RefreshResponse{
  accessToken: string;
  refreshToken: string;
}
