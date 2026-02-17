import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountryUpdateOrInsertEndpointService
} from '../../../../endpoints/country-endpoints/country-endpoints'
import {
  CountryGetByIdEndpointService,
  CountryGetByIdResponse
} from '../../../../endpoints/country-endpoints/country-getbyid-endpoint.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})
export class CountryEditComponent implements OnInit {
  countryId = 0;
  country: CountryGetByIdResponse = { id: 0, name: '' };
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countryUpsertService: CountryUpdateOrInsertEndpointService,
    private countryGetByIdService: CountryGetByIdEndpointService
  ) {}

  ngOnInit(): void {
    this.countryId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.countryId) {
      this.loadCountryData();
    }
  }

  loadCountryData(): void {
    this.loading = true;
    this.countryGetByIdService.handleAsync(this.countryId).subscribe({
      next: (res) => {
        this.country = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading country', err);
        this.loading = false;
      }
    });
  }

  updateCountry(): void {
    if (!this.country.name?.trim()) {
      return;
    }

    this.countryUpsertService.handleAsync({
      id: this.countryId,
      name: this.country.name.trim()
    }).subscribe({
      next: () => this.router.navigate(['/admin/countries']),
      error: (err) => console.error('Error updating country', err)
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/countries'])};
}
