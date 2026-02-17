import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-worker-welcome',
  templateUrl: './worker-welcome.component.html',
  styleUrl: './worker-welcome.component.css'
})
export class WorkerWelcomeComponent implements  OnInit {

  currentLang: string | undefined;

  constructor(private router: Router,
              private translate: TranslateService) {

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

  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang);
  }

  toWorker(){
    this.router.navigateByUrl('/worker/reservations');
  }

  toHome(){
    this.router.navigateByUrl('/public/home');
  }


}
