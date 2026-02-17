import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MySnackbarHelperService } from '../modules/shared/Snackbars/SnackBar-Service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private snackBar: MySnackbarHelperService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        if (error instanceof HttpErrorResponse) {
          // Forbidden
          if (error.status === 403) {
            this.snackBar.showMessage('Nemate dozvolu za pristup. Bićete preusmjereni.');
           this.router.navigate(['/']);
          }
          else if (error.status === 401) {
            this.snackBar.showMessage(`Greška: ${error.error?.message || 'Nepoznata greška'}`);
            this.router.navigate(['/login']);
          }
          else if(error.status === 400)
          {
            this.snackBar.showMessage('Nemate dozvolu za pristup');
            // this.router.navigate(['/']);
          }

        }

        return throwError(() => error);
      })
    );
  }
}
