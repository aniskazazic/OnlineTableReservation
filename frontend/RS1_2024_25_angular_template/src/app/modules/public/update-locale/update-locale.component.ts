import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {OwnerService} from '../../../endpoints/owner-controller/owner-controller';
import { TableService } from '../../../endpoints/tables-endpoint/tables-endpoints';
import { MyConfig } from '../../../my-config';
import {LocaleService} from '../../../endpoints/locale-endpoints/locale.service';


export interface LocaleDetails {
  id: number;
  name: string;
  address?: string;
  logo?: string | null; // može biti filename ili data URL (base64)
  ownerId?: number;
  cityId: number;
  categoryId: number;
  startOfWorkingHours: { hour: number; minute: number };
  endOfWorkingHours: { hour: number; minute: number };
  startOfWorkingHoursFormatted?: string;
  endOfWorkingHoursFormatted?: string;
  lengthOfReservation: number;
}

@Component({
  selector: 'app-update-locale',
  templateUrl: './update-locale.component.html',
  styleUrls: ['./update-locale.component.css'],
})
export class UpdateLocaleComponent implements OnInit {
  localeId!: number;

  localeDetails: LocaleDetails = {
    id: 0,
    name: '',
    cityId: 0,
    categoryId: 0,
    startOfWorkingHours: { hour: 0, minute: 0 },
    endOfWorkingHours: { hour: 0, minute: 0 },
    lengthOfReservation: 0,
    logo: null
  };

  showModal = false;
  cities: any[] = [];
  categories: any[] = [];
  isLoading = true;

  currentLang: string;

  // Preview i “nova vrijednost logo-a za slanje”
  logoPreview: string | null = null;           // data URL ili http URL (ako filename)
  selectedLogoDataUrl: string | null = null;   // ako korisnik izabere novu sliku → Data URL

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private Service: TableService,
    private localeService: LocaleService

  ) {
    this.currentLang = localStorage.getItem('language') || 'en';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.localeId = +params['id'];
      this.fetchLocaleDetails();
    });

    this.Service.checkIfOwner(this.localeId);

    this.fetchCities();
    this.fetchCategories();
  }

  // Pretvori {hour, minute} → "HH:mm" za <input type="time">
  private formatTimeToString(time: { hour: number; minute: number } | undefined): string {
    if (!time) return '';
    const hour = time.hour.toString().padStart(2, '0');
    const minute = time.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }

  // "HH:mm" → {hour, minute} (backend očekuje objekt)
  private convertStringToTimeObject(timeString: string): { hour: number; minute: number } {
    const [hour, minute] = (timeString || '00:00').split(':').map(Number);
    return { hour: isNaN(hour) ? 0 : hour, minute: isNaN(minute) ? 0 : minute };
  }

  // Ako u bazi imamo filename, gradi pun URL (služiš iz wwwroot/ImageFolder/LocaleLogo)
  private buildLogoUrlFromFileName(fileName: string): string {
    return `${MyConfig.api_address}/ImageFolder/LocaleLogo/${fileName}`;
  }

  fetchLocaleDetails(): void {
    this.isLoading = true;
    this.http
      .get<LocaleDetails>(`http://localhost:7000/LocaleGet?request=${this.localeId}`)
      .subscribe({
        next: (data) => {
          this.localeDetails = {
            ...data,
            startOfWorkingHoursFormatted: this.formatTimeToString(data.startOfWorkingHours),
            endOfWorkingHoursFormatted: this.formatTimeToString(data.endOfWorkingHours),
            logo: data.logo ?? null
          };

          // Preview (podržava i stari data URL i novi filename)
          if (this.localeDetails.logo) {
            this.logoPreview = this.localeDetails.logo.startsWith('data:')
              ? this.localeDetails.logo
              : this.buildLogoUrlFromFileName(this.localeDetails.logo);
          } else {
            this.logoPreview = null;
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching locale details:', err);
          this.isLoading = false;
        }
      });
  }

  fetchCities(): void {
    this.http.get<any[]>(`http://localhost:7000/cities/all`).subscribe({
      next: (data) => (this.cities = data),
      error: (err) => console.error('Error fetching cities:', err)
    });
  }

  fetchCategories(): void {
    this.http.get<any[]>(`http://localhost:7000/categories/all`).subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  // Upload kao u “add” — ne zovemo poseban /upload endpoint, nego čuvamo Data URL
  onLogoFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Molimo odaberite sliku (PNG/JPG/SVG).');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedLogoDataUrl = reader.result as string; // NOVA slika - Data URL
      this.logoPreview = this.selectedLogoDataUrl;        // odmah prikaži preview
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    const updateRequest: any = {
      id: this.localeId,
      name: this.localeDetails.name,
      address: this.localeDetails.address,
      startOfWorkingHours: this.convertStringToTimeObject(this.localeDetails.startOfWorkingHoursFormatted || '00:00'),
      endOfWorkingHours: this.convertStringToTimeObject(this.localeDetails.endOfWorkingHoursFormatted || '00:00'),
      cityId: this.localeDetails.cityId,
      categoryId: this.localeDetails.categoryId,
      lengthOfReservation: this.localeDetails.lengthOfReservation,
      // Šaljemo LOGO kao Data URL AKO je izabran novi; inače šaljemo filename iz baze (ako ga imamo),
      // ili null (ako je bio stari data URL i nismo uploadovali novi).
      logo: this.selectedLogoDataUrl
        ?? (this.localeDetails.logo && !this.localeDetails.logo.startsWith('data:') ? this.localeDetails.logo : null)
    };

    this.http.post(`http://localhost:7000/Locale/localeupdate`, updateRequest).subscribe({
      next: () => {
       // alert('Locale updated successfully!');
        this.router.navigate(['/owner/overview', this.localeId]);
      },
      error: (error) => {
        console.error('Error updating locale:', error);
        alert('Failed to update locale.');
      }
    });
  }

  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang);
  }



  toLocaleReservations(){
    this.router.navigateByUrl("/owner/reservations/"+ this.localeId)
  }

  toWorkers(){
    this.router.navigateByUrl("/owner/workers/"+ this.localeId)
  }

  toOverview(){
    this.router.navigateByUrl("/owner/overview/"+ this.localeId)
  }

  openRemoveModal(): void {
    this.showModal = true;
  }


  cancelRemove(): void {
    this.showModal = false;
  }

  confirmRemove(){
    if(this.localeId){
      {
        this.localeService.deleteLocale(this.localeId).subscribe(
          ()=> {
            this.router.navigate(['/public/home]']);
          },
          (error:any) => {
            console.error('Error while deleting locale');
            alert("An error occured while deleting locale");
          }
        );
      }
    }
  }

}
