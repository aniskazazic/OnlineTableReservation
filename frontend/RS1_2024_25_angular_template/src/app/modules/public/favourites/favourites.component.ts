import {Component, OnInit} from '@angular/core';
import {FavouriteDTO, FavouriteService} from '../../../endpoints/favourites-controller/favourites-controller';
import {Router} from '@angular/router';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})


export class FavouritesComponent implements OnInit{

  favourites: FavouriteDTO[] = [];
  showModal = false;
  localeId:number = 0;
  localeIdToRemove: number | null = null;

  constructor(private favouritesService: FavouriteService, private router:Router) {}

  ngOnInit() {
    this.loadFavourites();
  }

  loadFavourites(): void {
    this.favouritesService.getUserFavourites().subscribe({
      next: (res: FavouriteDTO[]) => {
        this.favourites = res.map(fav => {
          return {
            ...fav,
            startOfWorkingHours: this.formatTime(fav.startOfWorkingHours),
            endOfWorkingHours: this.formatTime(fav.endOfWorkingHours),
          };
        });

      },
      error: (err) => {
        console.error('Greška prilikom učitavanja favorita', err);
      }
    });
  }

  formatTime(time: any): string {
    if (
      time &&
      typeof time === 'object' &&
      time.hasOwnProperty('hour') &&
      time.hasOwnProperty('minute')
    ) {
      const hours = time.hour.toString().padStart(2, '0');
      const minutes = time.minute.toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '';
  }

  promptRemove(localeId: number): void {
    this.localeIdToRemove = localeId;
    this.showModal = true;
  }

  confirmRemove(): void {
    if (this.localeIdToRemove !== null) {
      this.favouritesService.removeFromFavourites(this.localeIdToRemove).subscribe({
        next: () => {
          this.loadFavourites();
          this.showModal = false;
          this.localeIdToRemove = null;
        }
      });
    }
  }

  cancelRemove(): void {
    this.showModal = false;
    this.localeIdToRemove = null;
  }

  navigate(id: number) {
    this.router.navigateByUrl(`/public/locale/${id}`);
  }

}
