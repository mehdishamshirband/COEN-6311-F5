import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeElementsOptions, StripeCardElementOptions,PaymentIntent } from '@stripe/stripe-js';
import {
  StripeService,
  StripeCardComponent,
  StripeCardNumberComponent,
  StripeCardExpiryComponent,
  StripeCardCvcComponent,
  StripeCardGroupDirective,
} from 'ngx-stripe';
import { switchMap } from 'rxjs/operators';
import {Observable} from "rxjs"
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Billing, PaymentState, PaymentType} from '../interfaces/booking.interface';
import { CartService } from "../services/cart.service";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    StripeCardNumberComponent,
    StripeCardExpiryComponent,
    StripeCardCvcComponent,
    StripeCardGroupDirective,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
      },
      invalid: {
        iconColor: '#bd1414',
        color: '#bd1414',
      },
    },
  };


  elementsOptions: StripeElementsOptions = {
    locale: 'auto',
    appearance: {
      theme: 'stripe'
    }
    };

  billingInformation: Billing = {
    id: 0,
    paymentType: undefined, // Seems impossible to get the card type from the card element
    paymentState: undefined,
    email: '',
    firstName: '',
    lastName: '',
    firstLineAddress: '',
    secondLineAddress: '',
    zipCode: '',
    city: '',
    state_area: '',
    country: '',
  };

  paymentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  })

  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private cartService: CartService) { }

  ngOnInit() {}

  pay(): void {
    if (!this.paymentForm.valid) {
      console.warn("Error", this.paymentForm);
      return;
    }

    this.createPaymentIntent(this.cartService.cart_total)
      .pipe(
        switchMap((pi:any) =>
          this.stripeService.confirmCardPayment(pi.client_secret, {
            payment_method: {
              card: this.card.element,
              billing_details: {
                name: this.paymentForm.get('name')!.value,
              },
            },
          })
        )
      )
      .subscribe((result: any) => {
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log(result.error.message);
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            //this.billingInformation.paymentType = this.VisaOrMastercard(this.card.element.card.brand);
            // Show a success message to your customer
          }
        }
      });
  }

  private baseUrl = 'http://localhost:8000/';

  createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${this.baseUrl}/create-payment-intent`,
      { amount }
    );
  }

}
