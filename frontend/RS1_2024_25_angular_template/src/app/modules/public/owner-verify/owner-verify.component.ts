import { Component, OnInit } from '@angular/core';
import { OwnerService, OwnerMeResponse } from '../../../endpoints/owner-controller/owner-controller'

@Component({
  selector: 'app-owner-verify',
  templateUrl: './owner-verify.component.html',
  styleUrls: ['./owner-verify.component.css']
})
export class OwnerVerifyComponent implements OnInit {
  me?: OwnerMeResponse;
  loading = false;
  sent = false;
  code = '';
  error = '';

  constructor(private ownerSvc: OwnerService) {}

  ngOnInit(): void {
    this.refresh();
  }

  get verified(): boolean {
    return !!this.me?.isVerified; // null -> false
  }

  refresh(): void {
    this.ownerSvc.me().subscribe({
      next: (res) => { this.me = res; },
      error: (e) => { this.error = 'Ne mogu učitati owner profil.'; }
    });
  }

  sendCode(): void {
    this.error = '';
    this.loading = true;
    this.ownerSvc.startPhoneVerification().subscribe({
      next: _ => { this.sent = true; this.loading = false; },
      error: e => {
        this.loading = false;
        this.error = e?.error?.error || e?.error?.message || 'Slanje koda nije uspjelo.';
      }
    });
  }

  confirm(): void {
    if (!this.code) return;
    this.error = '';
    this.loading = true;

    this.ownerSvc.confirmPhoneVerification(this.code).subscribe({
      next: res => {
        this.loading = false;
        if (res.verified) {
          this.refresh(); // učitava isVerified = true i sakriva UI
        } else {
          this.error = res.reason || 'Kod nije ispravan.';
        }
      },
      error: e => {
        this.loading = false;
        this.error = e?.error?.reason || e?.error?.message || 'Verifikacija nije uspjela.';
      }
    });
  }
}
