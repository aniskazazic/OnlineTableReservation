import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {MyConfig} from '../../my-config';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {AuthLoginEndpointService, LoginRequest} from './auth-login-endpoint.service';
import {Observable} from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string ;
  email: string;
  confirmPassword: string;
  isOwner: boolean;
  phoneNumber?:string;
  birthDate?: Date;
}

@Injectable({
  providedIn: 'root'
})

export class AuthRequestEndpointService implements MyBaseEndpointAsync<RegisterRequest> {
  private apiUrl = `${MyConfig.api_address}/auth/register`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request:RegisterRequest ): Observable<void> {
    return this.httpClient
      .post<void>(`${this.apiUrl}`, request)
      .pipe(
        tap(() => {
          console.log('Register');
        })
      );
  }
}
