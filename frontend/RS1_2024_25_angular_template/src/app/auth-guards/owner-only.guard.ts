import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { MyAuthService } from '../services/auth-services/my-auth.service';

@Injectable({ providedIn: 'root' })
export class OwnerOnlyGuard implements CanActivate {
  constructor(private auth: MyAuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.parseUrl('/login');
    }
    return this.auth.isOwner() ? true : this.router.parseUrl('/');
  }
}
