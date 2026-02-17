import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocaleService } from '../../endpoints/locale-endpoints/locale.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      console.error('Missing session_id in query params.');
      return;
    }

    const storedData = localStorage.getItem('localeRequest');
    if (!storedData) {
      console.error('Missing localeRequest data in localStorage.');
      return;
    }

    const r = JSON.parse(storedData);

    // Ako su vremena serijalizirana kao string "HH:mm", pretvori ih u {hour, minute}
    const normTime = (t: any) => {
      if (!t) return { hour: 0, minute: 0 };
      if (typeof t === 'string') {
        const [h, m] = t.split(':').map((v: string) => parseInt(v, 10));
        return { hour: h || 0, minute: m || 0 };
      }
      return { hour: Number(t.hour) || 0, minute: Number(t.minute) || 0 };
    };

    const s = normTime(r.startOfWorkingHours);
    const e = normTime(r.endOfWorkingHours);

    // ⇩⇩⇩ OVO je ključ: FLAT payload kakav backend očekuje
    const payload = {
      sessionId: sessionId,
      name: r.name,
      startHour: s.hour,
      startMinute: s.minute,
      endHour: e.hour,
      endMinute: e.minute,
      address: r.address,
      lengthOfReservation: Number(r.lengthOfReservation) || 0,
      logo: r.logo ?? null,                 // data URL: "data:image/png;base64,...."
      cityId: Number(r.cityId),
      categoryId: Number(r.categoryId),
      ownerId: Number(r.ownerId)
    };

    // (opcionalno) brzi sanity-check
    console.log('[Save payload]', {
      ...payload,
      logoSample: typeof payload.logo === 'string' ? payload.logo.slice(0, 40) + '...' : null
    });

    this.localeService.saveLocale(payload).subscribe({
      next: () => {
        localStorage.removeItem('localeRequest');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Failed to save locale after payment:', err)
    });


  }

}
