import {Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {
  AdminController,
  GetLocaleAdminRequest,
  GetLocaleAdminResponse
} from '../../../endpoints/AdminControllers/AdminController';
import {LocaleService} from '../../../endpoints/locale-endpoints/locale.service';
import {
  CityGetByIdEndpointService,
  CityGetByIdResponse
} from '../../../endpoints/city-endpoints/city-get-by-id-endpoint.service';
import {
  CountryGetAllEndpointService,
  CountryGetAllResponse
} from '../../../endpoints/country-endpoints/country-get-all-endpoint.service';
import {CategoryGetAllEndpoint, CategoryGetAllResponse} from '../../../endpoints/category-endpoint/CategoryGetEndpoint';

@Component({
  selector: 'app-admin-locale-management',
  templateUrl: './admin-locale-management.component.html',
  styleUrl: './admin-locale-management.component.css'
})
export class AdminLocaleManagementComponent  implements OnInit {
  locales: GetLocaleAdminResponse[] = [];
  editRow: { [key: number]: boolean } = {};
  page = 1;
  pageSize = 10;
  totalPages = 1;

  CitiesPerRow: { [key: number]: CityGetByIdResponse[] } = {};


  Category:CategoryGetAllResponse[]=[]
  City:CityGetByIdResponse[]=[];
  Country:CountryGetAllResponse[]=[];



  searchSubject:Subject<string> = new Subject<string>();
  s:string=' ';

  loadDeleted:boolean = false;



  constructor(private adminController: AdminController,
              private localeService:LocaleService,
              private cityService:CityGetByIdEndpointService,
              private countyService:CountryGetAllEndpointService,
              private categoryService:CategoryGetAllEndpoint
  ) {}

  ngOnInit(): void {
    this.loadCountry();
    this.loadCategory();
    this.loadLocales();
    this.initSearchListener()

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  onCountryChange(countryId: number, rowIndex: number): void {
    this.cityService.handleAsync(countryId).subscribe(response => {
      this.CitiesPerRow[rowIndex] = response;
    });
  }


  loadCity(id:number): void {
    this.cityService.handleAsync(id).subscribe(response => {
      this.City=response;
    })
  }


  loadCountry(){
    this.countyService.handleAsync().subscribe(response => {
      this.Country=response;
    })
  }
  loadCategory(){
    this.categoryService.handleAsync().subscribe(response => {
      this.Category=response;
    })
  }



  initSearchListener(){
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((x)=>{
      this.s=x;
      this.loadLocales();
    })
  }

  cb(){
    this.loadLocales();
  }



  loadLocales(): void {
    const request: GetLocaleAdminRequest = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      search: this.s,
      showDeleted: this.loadDeleted
    };

    this.adminController.getLocales(request).subscribe(response => {
      this.locales = response.dataItems;
      this.totalPages = response.totalPages;

      this.locales.forEach((locale, index) => {
        if (locale.countryId) {
          this.cityService.handleAsync(locale.countryId).subscribe(cities => {
            this.CitiesPerRow[index] = cities;
          });
        }
      });
    });
  }

  saveLocale(locale: GetLocaleAdminResponse, index: number): void {
    // Construct your update request with updated IDs
    const updateRequest = {
      id: locale.id,
      localeName: locale.localeName,
      countryId: locale.countryId,
      cityId: locale.cityId,
      address: locale.address,
      categoryId: locale.categoryId
    };

    this.adminController.updateLocale(updateRequest).subscribe({
      next: () => {
        this.editRow[index] = false;
        this.loadLocales();
      },
      error: (err) => console.error('Error saving:', err)
    });
  }

  deleteOrReactivate(locale: GetLocaleAdminResponse): void {
    if (locale.isDeleted) {
      this.adminController.reactiveLocale(locale.id).subscribe({
        next: () => this.loadLocales(),
        error: (err) => console.error('Error reactivating:', err)
      });
    } else {
      this.localeService.deleteLocale(locale.id).subscribe({
        next: () => this.loadLocales(),
        error: (err) => console.error('Error deleting:', err)
      });
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadLocales();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadLocales();
    }
  }
}
