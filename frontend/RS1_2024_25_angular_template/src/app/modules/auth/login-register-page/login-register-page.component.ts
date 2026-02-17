import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login-register-page',
  templateUrl: './login-register-page.component.html',
  styleUrls: ['./login-register-page.component.css']
})
export class LoginRegisterPageComponent {

  currentLang: string;

  constructor(private router: Router, private translate: TranslateService)
  {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang); // Persist the selected language
  }


  navigateTo(page: string): void {
    if (page === 'login') {
      this.router.navigate(['/login']); // Navigira na login stranicu
    } else if (page === 'register') {
      this.router.navigate(['/register']); // Navigira na register stranicu
    }
  }
}
