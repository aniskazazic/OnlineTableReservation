import {Component, OnInit} from '@angular/core';
import {AdminController,DashboardStats} from '../../../endpoints/AdminControllers/AdminController';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  currentLang:string;
  stats: DashboardStats={
    countOfActiveUsers:0,
    countOfDeletedUsers:0,
    countOfLocales:0,
    countOfUsers:0
  }

  constructor(private adminController: AdminController,private translate:TranslateService) {

    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  ngOnInit() {

    this.adminController.getStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
      }
    })

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

}


