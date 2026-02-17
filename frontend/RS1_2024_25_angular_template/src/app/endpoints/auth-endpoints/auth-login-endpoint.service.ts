import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {MyConfig} from '../../my-config';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {LoginTokenDto} from '../../services/auth-services/dto/login-token-dto';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {Observable} from 'rxjs';
import {MyAuthInfo} from '../../services/auth-services/dto/my-auth-info';

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthLoginEndpointService implements MyBaseEndpointAsync<LoginRequest, LoginResponse> {
  private apiUrl = `${MyConfig.api_address}/auth/login`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {
  }

  handleAsync(request: LoginRequest):Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}`, request).pipe(
      tap({
        next: (response:LoginResponse) => {
          if (response) {
            this.myAuthService.setLoggedInUser(response);
          } else {
            console.error('Response does not contain tokens:', response);  // Log if tokens are missing
          }
        },
        error: (err) => {
          console.error('Login error:', err);  // Log the error if the request fails
        }
      })
    );
  }
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  myAuthInfo:MyAuthInfo;
}

