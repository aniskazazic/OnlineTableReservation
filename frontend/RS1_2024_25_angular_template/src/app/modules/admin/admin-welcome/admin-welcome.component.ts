import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-welcome',
  templateUrl: './admin-welcome.component.html',
  styleUrl: './admin-welcome.component.css'
})
export class AdminWelcomeComponent implements OnInit {


  currentLang: string | undefined;

  constructor(private router: Router,
              private translate: TranslateService){

    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }



  ngOnInit() {
    this.translate.setDefaultLang('en');
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      this.translate.use(storedLang);
    }

  }

  toAdmin(){
    this.router.navigateByUrl('/admin/dashboard');
  }

  toHome(){
    this.router.navigateByUrl('/public/home');
  }


  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang);
  }



}
