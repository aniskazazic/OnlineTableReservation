
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { LocaleService, LocaleRequest } from '../../endpoints/locale-endpoints/locale.service';
import { TranslateService } from '@ngx-translate/core';
import {ISOLATE_TRANSLATE_SERVICE} from '@ngx-translate/core';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {OwnerService} from '../../endpoints/owner-controller/owner-controller';



@Component({
  selector: 'app-add-locale',
  templateUrl: './add-locale.component.html',
  styleUrls: ['./add-locale.component.css']
})

export class AddLocaleComponent implements OnInit {

  localeRequest: LocaleRequest = {
    name: '',
    logo: null,
    startOfWorkingHours: { hour: 0, minute: 0 },
    endOfWorkingHours: { hour: 0, minute: 0 },
    cityId: 0,
    categoryId: 0,
    ownerId: 0,
    IsDeleted: false,
    DeleteAt: null,
    address: '',
    lengthOfReservation: 0,
  };

  userId: number = 0;
  validationErrors: string[] = [];
  cities: any[] = [];
  categories: any[] = [];
  logoPreview: string | ArrayBuffer | null = null;
  currentLang: string;



  constructor(
    private localeService: LocaleService,
    private router: Router,
    private translate: TranslateService,
    private authservice: MyAuthService,
    private service: OwnerService
  ) {
    this.currentLang = localStorage.getItem('language') || 'en';

    const authUserId = this.authservice.getMyAuthInfo()?.personID;
    const newlyRegisteredId = localStorage.getItem('newlyRegisteredOwnerId');

    this.userId = newlyRegisteredId ? Number(newlyRegisteredId) : authUserId ? Number(authUserId) : 0;
  }


  ngOnInit(): void {
    console.log('userId iz localStorage ili authService:', this.userId);
    this.loadCities();
    this.loadCategories();


  }

  loadCities() {
    this.localeService.getCities().subscribe({
      next: (data) => this.cities = data,
      error: (err) => console.error('Error loading cities:', err)
    });
  }

  loadCategories() {
    this.localeService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories:', err)
    });
  }







  onSubmit() {
    if (!this.isValid()) {
      console.log('Form is invalid. Errors:', this.validationErrors);
      return;
    }

    // Dohvati ownerId asinhrono
    this.service.getOwnerId(this.userId).subscribe({
      next: (ownerId:number) => {
        this.localeRequest.ownerId = ownerId;
        //alert("Owner je: " + this.localeRequest.ownerId);

        // Pripremi payload
        const requestPayload = {
          ...this.localeRequest,
          cityId: Number(this.localeRequest.cityId),
          categoryId: Number(this.localeRequest.categoryId),
        };

        console.log("R---------->", requestPayload);
        localStorage.setItem('localeRequest', JSON.stringify(requestPayload));

        // Kreiraj Stripe checkout session
        this.localeService.createCheckoutSession(requestPayload).subscribe({
          next: (response: any) => {
            console.log('Stripe Checkout Session Created:', response);
            localStorage.removeItem('newlyRegisteredOwnerId');

            if (response.paymentUrl) {
              window.location.href = response.paymentUrl;
            } else {
              console.error('Payment URL is missing in the response.');
            }
          },
          error: (err) => {
            console.error('Error creating Stripe session:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching ownerId:', err);
        alert('Ne mogu dohvatiti Owner ID. Provjerite login.');
      },
    });



  }


  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
        this.localeRequest.logo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onTimeChange(field: 'startOfWorkingHours' | 'endOfWorkingHours', event: Event) {
    const input = event.target as HTMLInputElement;
    const timeString = input.value;
    const [hour, minute] = timeString.split(':').map((val) => parseInt(val, 10));
    this.localeRequest[field] = { hour, minute };
  }



  isValid(): boolean {
    this.validationErrors = [];

    if (this.localeRequest.name.trim() === '') {
      this.validationErrors.push('Name is required.');
    }
    if (!this.localeRequest.cityId) {
      this.validationErrors.push('City is required.');
    }
    if (!this.localeRequest.categoryId) {
      this.validationErrors.push('Category is required.');
    }
    if (
      !this.localeRequest.startOfWorkingHours ||
      this.localeRequest.startOfWorkingHours.hour == null ||
      this.localeRequest.startOfWorkingHours.minute == null
    ) {
      this.validationErrors.push('Start of working hours must have valid hour and minute values.');
    }
    if (
      !this.localeRequest.endOfWorkingHours ||
      this.localeRequest.endOfWorkingHours.hour == null ||
      this.localeRequest.endOfWorkingHours.minute == null
    ) {
      this.validationErrors.push('End of working hours must have valid hour and minute values.');
    }


    return this.validationErrors.length === 0;
  }





  changeLanguage(event: any): void {
    const selectedLang = event.target.value;
    this.translate.use(selectedLang);
    this.currentLang = selectedLang;
    localStorage.setItem('language', selectedLang);
  }
}
