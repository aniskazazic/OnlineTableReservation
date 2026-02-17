import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
export interface LocaleGetResponse {
  localeId: number;
  name: string;
  cityName: string;
  logo: string; // Base64 string
  averageRating: number;
}

export interface Category {
  id: number;
  name: string;
  locales: LocaleGetResponse[];
  currentIndex: number;
  animationIndex?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;
  private searchSubject: Subject<string> = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  /** Step 1: Load categories from API */
  loadCategories(): void {
    this.http.get<{ id: number; name: string }[]>('http://localhost:7000/Category/GetAll')
      .subscribe({
        next: (data) => {
          // Map API data to Category model with default properties
          this.categories = data.map(c => ({
            id: c.id,
            name: c.name,
            locales: [],
            currentIndex: 0,
            animationIndex: 0
          }));

          // After categories load, fetch locales for each category
          this.categories.forEach(category => this.loadLocales(category));
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.isLoading = false;
        }
      });
  }


  loadLocales(category: Category): void {
    this.http
      .get<LocaleGetResponse[]>(`http://localhost:7000/LocaleGetCategory?CategoryId=${category.id}`)
      .subscribe({
        next: (data) => {
          category.locales = data;
          //this.fetchAverageRatings(category.locales);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(`Error fetching locales for category ${category.id}:`, err);
          this.isLoading = false;
        }
      });
  }

  /** Scroll functions */
  scrollRight(category: Category): void {
    if (category.currentIndex + 3 < category.locales.length) {
      category.currentIndex++;
    }
  }

  scrollLeft(category: Category): void {
    if (category.currentIndex > 0) {
      category.currentIndex--;
    }
  }

  getTransform(category: Category): string {
    const offset = category.currentIndex * (100 / 3);
    return `translateX(-${offset}%)`;
  }
}
