import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TwoFAService {
  constructor(private http: HttpClient) {
  }

  start() {
    return this.http.post<{ status: string }>('/Owner/StartPhoneVerification', {});
  }

  confirm(code: string) {
    return this.http.post<{ verified: boolean; reason?: string }>('/Owner/ConfirmPhoneVerification', {code});
  }
}
