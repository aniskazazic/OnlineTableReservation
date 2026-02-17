import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BehaviorSubject, Subject, combineLatest, switchMap,
  debounceTime, distinctUntilChanged, startWith, takeUntil, tap
} from 'rxjs';
import {
  LocaleSearchService, CountryGetAllResponse, CityGetAll1Response, LocaleCard
} from '../../../services/locale-search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locale-search',
  templateUrl: './locale-search.component.html',
  styleUrls: ['./locale-search.component.css'],
})
export class LocaleSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form!: FormGroup;

  countries: CountryGetAllResponse[] = [];
  allCities: CityGetAll1Response[] = [];
  citiesFiltered: CityGetAll1Response[] = [];
  categories: { id: number; name: string; description: string }[] = [];

  loading = false;
  locales$ = new BehaviorSubject<LocaleCard[]>([]);

  constructor(
    private fb: FormBuilder,
    private svc: LocaleSearchService,
    private router: Router
  ) {
    this.form = this.fb.group({
      q: [''],
      countryName: [''],
      cityName: [''],
      categoryId: [null as number | null],
    });
  }

  trackByLocaleId = (_: number, item: LocaleCard) => item.localeId;

  ngOnInit(): void {
    // liste
    this.svc.getCategories().pipe(takeUntil(this.destroy$)).subscribe(ks => this.categories = ks || []);
    this.svc.getCountries().pipe(takeUntil(this.destroy$)).subscribe(cs => this.countries = cs || []);
    this.svc.getCitiesAll().pipe(takeUntil(this.destroy$)).subscribe(cs => {
      this.allCities = cs || [];
      this.citiesFiltered = this.allCities;
    });

    // kaskadni gradovi po državi
    this.form.get('countryName')!.valueChanges
      .pipe(startWith(this.form.get('countryName')!.value), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(countryName => {
        const cName = (countryName || '').trim();
        this.citiesFiltered = cName
          ? this.allCities.filter(c => (c.countryName || '').toLowerCase() === cName.toLowerCase())
          : this.allCities;

        const currentCity = (this.form.get('cityName')!.value || '').toString();
        if (currentCity && !this.citiesFiltered.some(c => c.name.toLowerCase() === currentCity.toLowerCase())) {
          this.form.get('cityName')!.setValue('');
        }
      });

    // streamovi inputa
    const q$ = this.form.controls['q'].valueChanges.pipe(
      startWith(this.form.controls['q'].value ?? ''),
      debounceTime(300),
      distinctUntilChanged()
    );
    const country$ = this.form.controls['countryName'].valueChanges.pipe(
      startWith(this.form.controls['countryName'].value ?? ''),
      distinctUntilChanged()
    );
    const city$ = this.form.controls['cityName'].valueChanges.pipe(
      startWith(this.form.controls['cityName'].value ?? ''),
      distinctUntilChanged()
    );
    const cat$ = this.form.controls['categoryId'].valueChanges.pipe(
      startWith(this.form.controls['categoryId'].value ?? null),
      distinctUntilChanged()
    );

    // JEDAN poziv — uvijek šaljemo sva 4 filtera
    combineLatest([q$, country$, city$, cat$])
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(([q, countryName, cityName, categoryId]) =>
          this.svc.searchLocalesRaw({
            q: q ?? '',
            countryName: countryName ?? '',
            cityName: cityName ?? '',
            categoryId: categoryId ?? null,
            pageNumber: 1,
            pageSize: 24,
          })
        ),
        switchMap(paged => this.svc.enrichWithLogos(paged.dataItems)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: cards => { this.locales$.next(cards); this.loading = false; },
        error: () => { this.locales$.next([]); this.loading = false; }
      });
  }

  resetFilters() {
    this.form.reset({ q: '', countryName: '', cityName: '', categoryId: null });
    this.citiesFiltered = this.allCities;
  }

  openLocale(localeId: number) {
    this.router.navigate(['/public/locale', localeId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
