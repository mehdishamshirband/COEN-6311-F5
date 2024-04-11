import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {CartService} from "../services/cart.service";
import {CheckoutService} from "../services/checkout.service";
import { HttpClient } from '@angular/common/http';
import {
  Billing,
  Booking,
  BookingState,
  PaymentState,
  PaymentType,
  TravelPackage
} from '../interfaces/booking.interface';
import {PaymentIntent} from "@stripe/stripe-js";
import {Observable} from "rxjs";

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  result: any | undefined;
  guestData: any | undefined;
  guestCart: any | undefined;
  billingInformation!: Billing;
  bookingInformation!: Booking;
  private baseUrl = 'http://localhost:8000/';
  check_error = false;

  constructor(public cartService: CartService,
              private checkoutService: CheckoutService,
              private http: HttpClient) {}

  ngOnInit() {
    this.result = history.state.result;
    this.guestData = this.checkoutService.getLocalStoreGuestData[0];
    this.guestCart = this.cartService.user_cart;
    console.log(this.result);

    this.billingInformation = {
      id: 0,
      paymentType: PaymentType.Stripe, // Seems impossible to get the card type from the card element
      paymentState: PaymentState.FirstDeposit,
      email: this.guestData.email,
      firstName: this.guestData.firstName,
      lastName: this.guestData.lastName,
      firstLineAddress: this.guestData.firstLineAddress,
      secondLineAddress: this.guestData.secondLineAddress,
      zipCode: this.guestData.zipCode,
      city: this.guestData.city,
      state_area: this.guestData.state_area,
      country: this.guestData.country,
    };
    console.log(this.billingInformation);

    for (let i = 0; i < this.cartService.user_cart.length; i++) {
      this.CreateAndPostBooking(this.cartService.user_cart[i]);
      console.log(this.bookingInformation);
      //this.checkoutService.postBooking(this.bookingInformation);
    }

    if (!this.check_error){
      this.cartService.clearLocalCart();
      this.checkoutService.clearLocalStoreGuestData();
    }

  }

  CreateAndPostBooking = (travelPackage : TravelPackage) => {
    this.bookingInformation = {
      id: 0,
      bookingNo: '0',
      cost: travelPackage.price,
      purchaseDate: new Date(),
      billing: this.billingInformation,
      bookingState: BookingState.Processing,
      travelPackage: travelPackage,
      email: this.guestData.email,
      firstName: this.guestData.firstName,
      lastName: this.guestData.lastName,
      firstLineAddress: this.guestData.firstLineAddress,
      secondLineAddress: this.guestData.secondLineAddress,
      zipCode: this.guestData.zipCode,
      city: this.guestData.city,
      state_area: this.guestData.state_area,
      country: this.guestData.country,
      phone: this.guestData.phone,
    };

    void this.postBookingData(this.bookingInformation).subscribe((result: any) => {
      if (result.error) {
        console.warn("Error", result.error);
        this.check_error = true;
      }
      else{
        console.warn("Post result", result);
      }
    }
    );

  }


  postBookingData(bookingInformation: Booking): Observable<Booking> {
    return this.http.post<Booking>(
          `${this.baseUrl}Booking/`, bookingInformation
        );
  }

  mergeArrays = (arr1: any | undefined, arr2: any | undefined) => {
    // Merge two arrays of objects => don't work
    return arr1.map((item: any , i: any) => {
      return Object.assign({}, item, arr2[i]);
    });
  }

}
