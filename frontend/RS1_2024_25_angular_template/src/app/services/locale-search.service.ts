import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LocaleFilterItem {
  id: number;                 // mapira se iz: ID
  localeName: string;         // LocaleName
  cityName: string;           // CityName
  countryName: string;        // CountryName
  startOfWorkingHours: string;// TimeOnly -> string
  endOfWorkingHours: string;  // TimeOnly -> string
  ownerName: string;
  address: string;
}

export interface MyPagedList<T> {
  dataItems: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export interface LocaleGetResponseId {
  id: number;
  name: string;
  logo?: string | null; // base64
  cityId: number;
  cityName: string;
  categoryId: number;
  startOfWorkingHours: string; // TimeOnly string
  endOfWorkingHours: string;   // TimeOnly string
  ownerName: string;
  address: string;
}

export interface LocaleGetByCategoryResponse {
  localeId: number;
  name: string;
  cityName: string;
  logo: string; // base64
}

export interface CityGetAll1Response {
  id: number;         // mapira se iz: ID
  name: string;       // Name
  countryName: string;
}

export interface CountryGetAllResponse {
  id: number; // mapira se iz: ID
  name: string;
}

export interface LocaleCard {
  localeId: number;
  name: string;
  cityName: string;
  logo: string | null;      // base64 or URL
  averageRating?: number;   // opciono
}

export interface LocaleSearchRequest {
  q?: string;               // FilterLocaleName
  countryName?: string;     // FilterCountryName
  cityName?: string;        // FilterCityName
  categoryId?: number | null; // FilterCategoryId
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class LocaleSearchService {
  private base = 'http://localhost:7000';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<CountryGetAllResponse[]> {
    return this.http.get<CountryGetAllResponse[]>(`${this.base}/countries/all`).pipe(
      map(list => list.map(x => ({ id: (x as any).id ?? (x as any).ID, name: (x as any).name ?? (x as any).Name })))
    );
  }

  getCategories() {
    return this.http.get<any[]>(`${this.base}/categories/all`).pipe(
      map(list => (list || []).map(x => ({
        id: x.id ?? x.ID,
        name: x.name ?? x.Name,
        description: x.description ?? x.Description,
      })))
    );
  }

  getCitiesAll(): Observable<CityGetAll1Response[]> {
    return this.http.get<CityGetAll1Response[]>(`${this.base}/cities/all`).pipe(
      map(list => list.map(x => ({
        id: (x as any).id ?? (x as any).ID,
        name: (x as any).name ?? (x as any).Name,
        countryName: (x as any).countryName ?? (x as any).CountryName
      })))
    );
  }

  /** JEDINI poziv za pretragu — šalje SVE filtere na /locales/filter */
  searchLocalesRaw(req: LocaleSearchRequest) {
    let params = new HttpParams()
      .set('pageNumber', String(req.pageNumber ?? 1))
      .set('pageSize', String(req.pageSize ?? 24));

    const q = (req.q ?? '').trim();
    const city = (req.cityName ?? '').trim();
    const country = (req.countryName ?? '').trim();

    if (q.length)       params = params.set('FilterLocaleName', q);
    if (city.length)    params = params.set('FilterCityName', city);
    if (country.length) params = params.set('FilterCountryName', country);
    if (req.categoryId != null) params = params.set('FilterCategoryId', String(req.categoryId));

    return this.http.get<MyPagedList<LocaleFilterItem>>(`${this.base}/locales/filter`, { params })
      .pipe(
        map(res => ({
          ...res,
          dataItems: res.dataItems.map((it: any) => ({
            id: it.id ?? it.ID,
            localeName: it.localeName ?? it.LocaleName,
            cityName: it.cityName ?? it.CityName,
            countryName: it.countryName ?? it.CountryName,
            startOfWorkingHours: it.startOfWorkingHours ?? it.StartOfWorkingHours,
            endOfWorkingHours: it.endOfWorkingHours ?? it.EndOfWorkingHours,
            ownerName: it.ownerName ?? it.OwnerName,
            address: it.address ?? it.Address,
          }))
        }))
      );
  }

  /** Obogaćivanje logom za kartice */
  enrichWithLogos(items: LocaleFilterItem[]) {
    if (!items?.length) return of([]);

    const calls = items.map(i =>
      this.http.get<LocaleGetResponseId>(`${this.base}/LocaleGet`, { params: { request: i.id } as any })
        .pipe(
          map(detail => ({
            localeId: detail.id,
            name: detail.name,
            cityName: detail.cityName,
            logo: detail.logo || null
          } as LocaleCard)),
          catchError(() => of({
            localeId: i.id,
            name: i.localeName,
            cityName: i.cityName,
            logo: null
          } as LocaleCard))
        )
    );

    return forkJoin(calls);
  }

  /** (Opcionalno) i dalje može ostati, ali za pretragu više nije potrebno */
  getByCategory(categoryId: number) {
    return this.http
      .get<any[]>(`${this.base}/LocaleGetCategory`, { params: { CategoryId: categoryId } as any })
      .pipe(map(list => (list || []).map(x => ({
        localeId: x.localeId,
        name: x.name,
        cityName: x.cityName,
        logo: x.logo
      }))));
  }
}
