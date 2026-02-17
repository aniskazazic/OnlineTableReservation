import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MyAuthInfo} from "./dto/my-auth-info";
import {LoginResponse} from '../../endpoints/auth-endpoints/auth-login-endpoint.service';
import {Router} from "@angular/router";
import {RefreshResponse} from './my-auth-interceptor.service';

@Injectable({providedIn: 'root'})
export class MyAuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  logout() {
    localStorage.removeItem('my-auth-token');
    localStorage.removeItem('my-auth-info');
    document.cookie = "my-refresh-token=; Max-Age=0; Path=/auth/token;";
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  setLoggedInUser(x: LoginResponse | null) {
    if (x == null) {
      window.localStorage.setItem("my-auth-token", '');
      document.cookie = "my-refresh-token=; Max-Age=0; Path=/; Secure; SameSite=Strict";
      localStorage.removeItem("my-auth-info");
    } else {
      window.localStorage.setItem("my-auth-token", x.accessToken);
      window.localStorage.setItem("my-auth-info", JSON.stringify(x.myAuthInfo));
      document.cookie = `my-refresh-token=${x.refreshToken}; Path=/; Max-Age=604800; Secure; SameSite=Strict`;
    }
  }

  SetLoggedInUser(x: RefreshResponse | null) {
    if (x == null) {
      window.localStorage.setItem("my-auth-token", '');
      document.cookie = "my-refresh-token=; Max-Age=0; Path=/; Secure; SameSite=Strict";
    } else {
      window.localStorage.setItem("my-auth-token", x.accessToken);
      document.cookie = `my-refresh-token=${x.refreshToken}; Path=/; Max-Age=604800; Secure; SameSite=Strict`;
    }
  }

  getLoginToken(): string | null {
    const tokenString = window.localStorage.getItem("my-auth-token") ?? "";
    return tokenString || null;
  }

  getRefreshToken(): string | null {
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find((row) => row.trim().startsWith('my-refresh-token='));
    if (refreshTokenCookie) return refreshTokenCookie.split('=')[1];
    return null;
  }

  getMyAuthInfo(): MyAuthInfo | null {
    const data = localStorage.getItem("my-auth-info");
    if (!data) return null;
    try {
      const plainObject = JSON.parse(data);
      return MyAuthInfo.fromJSON(plainObject);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getLoginToken();
  }

  isOwner(): boolean {
    const info = this.getMyAuthInfo() as any;
    if (info && (info.isOwner === true || info.IsOwner === true)) return true;

    const p = this.tokenPayload;
    if (!p) return false;

    const role = p.role ?? p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const hasOwnerRole = Array.isArray(role) ? role.includes('Owner') : role === 'Owner';
    return hasOwnerRole || p.isOwner === true || p.IsOwner === true;
  }

  hasRole(target: string): boolean {
    const p = this.tokenPayload;
    if (!p) return false;
    const role = p.role ?? p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (Array.isArray(role)) return role.some((r: string) => r?.toLowerCase() === target.toLowerCase());
    return (role?.toLowerCase?.() === target.toLowerCase());
  }

  private get tokenPayload(): any | null {
    const t = this.getLoginToken();
    if (!t) return null;
    const parts = t.split('.');
    if (parts.length !== 3) return null;
    try {
      const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
      try {
        return JSON.parse(atob(parts[1]));
      } catch {
        return null;
      }
    }
  }
}
