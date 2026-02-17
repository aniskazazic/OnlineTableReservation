import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  CountryUpdateOrInsertEndpointService,
  CountryUpdateOrInsertRequest,
  CountryUpdateOrInsertResponse
} from '../../../../../endpoints/country-endpoints/country-endpoints'

@Component({
  selector: 'app-country-new',
  templateUrl: './country-new.component.html',
  styleUrls: ['./country-new.component.css']
})
export class CountryNewComponent {
  name = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private countryUpsert: CountryUpdateOrInsertEndpointService,
    private router: Router
  ) {}

  save(): void {
    this.errorMsg = '';
    this.successMsg = '';

    const trimmed = this.name.trim();
    if (!trimmed) {
      this.errorMsg = 'Country name is required.';
      return;
    }

    const req: CountryUpdateOrInsertRequest = { name: trimmed }; // insert (bez id)
    this.loading = true;

    this.countryUpsert.handleAsync(req).subscribe({
      next: (res: CountryUpdateOrInsertResponse) => {
        this.loading = false;
        this.successMsg = `Country "${res.name}" created (ID: ${res.id}).`;
        this.router.navigate(['/admin/countries']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Failed to create country. Please try again.';
        console.error('Create country error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/countries']);
  }
}
