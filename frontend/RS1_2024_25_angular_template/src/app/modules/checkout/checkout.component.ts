import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private stripePromise = loadStripe('pk_test_51QeakHG280gBJV2dOv2gaQWLGzOpzf34DmU2S8PZMR5VB4V42ZmXJcPnYDQNcduqFYwevFSYuoTGrcXOFvhfHWwO00DZjLYEMq'); // Tvoj publishable key

  constructor(private http: HttpClient) {}

  async checkout() {
    const stripe = await this.stripePromise;

    if (!stripe) {
      console.error('Stripe nije pravilno učitan.');
      return;
    }

    this.http.post<any>('http://localhost:7000/Checkout/CreateSession', {
      productName: 'Test Proizvod',
      amount: 2000,
      quantity: 1,
      successUrl: 'http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: 'http://localhost:4200/cancel'
    }).subscribe(async (response: any) => {
      const result = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (result.error) {
        console.error('Greška pri preusmeravanju na Stripe Checkout:', result.error.message);
      }
    }, error => {
      console.error('Greška pri kreiranju sesije:', error);
    });
  }


}
