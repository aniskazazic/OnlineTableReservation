import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MyConfig} from '../../../my-config';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  private apiUrl = `${MyConfig.api_address}/auth/logout`;

  constructor(
    private httpClient: HttpClient,
    private authService: MyAuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.logout();
  }

  logout(): void {
    this.httpClient.post<void>(this.apiUrl, {}).subscribe({
      next: () => this.handleLogoutSuccessOrError(),
      error: (error) => {
        console.error('Error during logout:', error);
        this.handleLogoutSuccessOrError();
      }
    });
  }

  // Metoda za zajedničko uklanjanje tokena i preusmjeravanje
  private handleLogoutSuccessOrError(): void {
    this.authService.setLoggedInUser(null);
    localStorage.removeItem('my-auth-token');
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setTimeout(() => {
      this.router.navigate(['/auth/login']); // Preusmjeravanje na login nakon 3 sekunde
    }, 3000);
  }
}
