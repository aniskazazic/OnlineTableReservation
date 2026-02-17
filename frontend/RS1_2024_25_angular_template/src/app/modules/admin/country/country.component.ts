import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CountryGetAllEndpointService,
  CountryGetAllResponse
} from '../../../endpoints/country-endpoints/country-get-all-endpoint.service';
import { CountryDeleteEndpointService } from '../../../endpoints/country-endpoints/country-delete-endpoint.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  countries: CountryGetAllResponse[] = [];
  loading = false;

  constructor(
    private countryGetService: CountryGetAllEndpointService,
    private countryDeleteService: CountryDeleteEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries(): void {
    this.loading = true;
    this.countryGetService.handleAsync().subscribe({
      next: (data) => { this.countries = data; this.loading = false; },
      error: (err) => { console.error('Error fetching countries:', err); this.loading = false; }
    });
  }

  newCountry(): void {
    this.router.navigate(['/admin/country/new']);
  }

  editCountry(id: number): void {
    this.router.navigate(['/admin/country/edit', id]);
  }

  deleteCountry(id: number): void {
    if (!confirm('Are you sure you want to delete this country?')) return;

    this.countryDeleteService.handleAsync(id).subscribe({
      next: () => {
        this.countries = this.countries.filter(c => c.id !== id);
      },
      error: (err) => console.error('Error deleting country:', err)
    });
  }
}

