import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoginEndpointService, LoginRequest } from '../../../endpoints/auth-endpoints/auth-login-endpoint.service';
import { TranslateService } from '@ngx-translate/core';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest: LoginRequest = { username: '', password: '' };
  errorMessage: string | null = null;
  currentLang: string;

  constructor(
    private authLoginService: AuthLoginEndpointService,
    private router: Router,
    private translate: TranslateService,
    private authService:MyAuthService
  ) {

    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  onLogin(): void {
    this.authLoginService.handleAsync(this.loginRequest).subscribe({
      next: (response) => {
        const userInfo = response.myAuthInfo;



        if(this.authService.getMyAuthInfo()?.isAdmin){
          this.router.navigate(['/admin/welcome']);
        }
        else if(this.authService.getMyAuthInfo()?.isWorker){
          this.router.navigate(['/worker/welcome']);
        }
        else {
          this.router.navigate(['/public']);
        }
      },
      error: (error: any) => {
        this.translate.get('LOGIN.ERROR').subscribe((translatedMessage: string) => {
          this.errorMessage = translatedMessage;
        });
        console.error('Login error:', error);
      }
    });
  }

  navigateTo(page: string): void {
    this.router.navigate(['/register']);
  }

  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang); // Persist the selected language
  }
}
