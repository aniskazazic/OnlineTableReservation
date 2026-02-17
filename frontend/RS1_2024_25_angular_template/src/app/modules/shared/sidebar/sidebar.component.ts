import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MyAuthService} from '../../../services/auth-services/my-auth.service';
import {LocaleGetByOwnerResponse, LocaleGetByOwnerService} from '../../../endpoints/locale-endpoints/localeGetByOwner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  ownerId:number=0;
  locales:LocaleGetByOwnerResponse[] = [];
  isWorker:boolean=false;
  isOwner:boolean=false;

  constructor(private router: Router, private myAuthService: MyAuthService, private localeowner: LocaleGetByOwnerService) {
  }

  ngOnInit() {

    const authInfo = this.myAuthService.getMyAuthInfo();
    this.isWorker = authInfo?.isWorker || false;
    this.isOwner=authInfo?.isOwner || false;

    this.loadOwnerLocales();
  }

  showAiChat = false;

  toggleAiChat() {
    this.showAiChat = !this.showAiChat;
  }

  toFavourite(){
     this.router.navigateByUrl('/public/favourites');
  }

  toHome(){
    this.router.navigateByUrl('/public/home');
  }
  toReservation(){
    this.router.navigateByUrl('/public/user-reservations');}
  toSearch() {
    this.router.navigate(['/locale-search']);
  }

  Logout(){
    this.myAuthService.logout();
    this.router.navigate(['/login']);
  }

  Reservations(){
    this.router.navigate(['/public/user-reservations']);
  }

  loadOwnerLocales(){

    this.ownerId=<number>this.myAuthService.getMyAuthInfo()?.personID;



    this.localeowner.getLocalesByOwner(this.ownerId).subscribe({
      next: (data) => {
        this.locales = data;

      },
      error: (err) => console.error('Error fetching locales:', err)
    });


  }

  AddNewLocale(){
    this.router.navigate(['/addlocale']);
  }


  toLocale(x: number) {
    // Ovo osigurava da se navigacija desi čak i ako je ruta ista
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/owner/overview/' + x]);
    });
  }
}
