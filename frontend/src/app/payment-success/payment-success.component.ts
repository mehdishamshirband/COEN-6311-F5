import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {CartService} from "../services/cart.service";
import {CheckoutService} from "../services/checkout.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TravelPackageService } from "../services/travel-package.service";
import {
  Billing,
  Booking,
  BookingState, NbrPerson,
  PaymentState,
  PaymentType,
  TravelPackage
} from '../interfaces/booking.interface';
import {PaymentIntent} from "@stripe/stripe-js";
import {lastValueFrom, Observable} from "rxjs";

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
  _result!: any;
  travelPackageId: number = -1;

  header = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + sessionStorage.getItem('accessToken')!
  });

  constructor(public cartService: CartService,
              private checkoutService: CheckoutService,
              private http: HttpClient,
              private travelPackageService: TravelPackageService) {}

  async ngOnInit() {
    this.result = history.state.result;
    this.guestData = this.checkoutService.getLocalStoreGuestData[0];
    this.guestCart = this.cartService.user_cart;
    console.log(this.result);

    this.billingInformation = {
      id: 0,
      paymentType: PaymentType.Visa, // Seems impossible to get the card type from the card element
      paymentState: PaymentState.LastDeposit,
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

    this._result = await this.postBillingDataSynchronous(this.billingInformation)

    if (this._result.error) {
      console.warn("Error post billing", this._result.error.message);
    }
    else{
      console.warn("Post billing result", this._result);
      this.billingInformation.id = this._result.id;
    }



    for (let i = 0; i < this.cartService.user_cart.length; i++) {
      this.travelPackageId = -1;
      this.checkCustomPackage(this.cartService.user_cart[i]);

      if (this.cartService.user_cart[i].name === "Your perfect journey") {
        await new Promise(f => setTimeout(f, 1000));
        // Wait for the custom package to be added (1 second)
      }

      this.CreateAndPostBooking(this.cartService.user_cart[i], this.cartService.user_cart_nbr_person(this.travelPackageId), this.travelPackageId);
      console.log(this.bookingInformation);
    }

    if (!this.check_error){
      this.cartService.clearLocalCart();
      this.checkoutService.clearLocalStoreGuestData();
    }

  }

  CreateAndPostBooking = (travelPackage : TravelPackage, nbr_person: NbrPerson, travelPackageId: number) => {
    travelPackage.id = travelPackageId; // Don't change anything when pre-made, but update the id when custom package

    this.bookingInformation = {
      id: 0,
      bookingNo: '0',
      cost: Number(travelPackage.price),
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
      nbr_adult: nbr_person.nbr_adult,
      nbr_child: nbr_person.nbr_child,
    };

    void this.postBookingData(this.bookingInformation).subscribe((result: any) => {
      if (result.error) {
        console.warn("Error", result.error);
        this.check_error = true;
      }
      else{
        console.warn("Post result", result);
        this._result = result;
      }
    }
    );

  }


  postBillingData(billingInformation: Billing): Observable<Billing> {
    let body : any = billingInformation;
    body.user = 1; // New feature from back, require to add user even if we can't fetch the user id from the backend

    console.warn("Billing send", body)

    return this.http.post<Billing>(
          `${this.baseUrl}BillingDetail/`, body , {headers: this.header}
        );
  }

  async postBillingDataSynchronous(billingInformation: Billing) {
    return await lastValueFrom(this.postBillingData(billingInformation)).then((data) => {
      return data;
    });
  }

  postBookingData(bookingInformation: Booking): Observable<Booking> {
    let body : any = bookingInformation;
    body.user = 1; // New feature from back, require to add user even if we can't fetch the user id from the backend

    console.warn("Booking send", body)

    return this.http.post<Booking>(
          `${this.baseUrl}Booking/`, body, {headers: this.header}
        );
  }

  mergeArrays = (arr1: any | undefined, arr2: any | undefined) => {
    // Merge two arrays of objects => don't work
    return arr1.map((item: any , i: any) => {
      return Object.assign({}, item, arr2[i]);
    });
  }

  checkCustomPackage = (travelPackage: TravelPackage): any => {
    if (travelPackage.name === "Your perfect journey") {
      let authToken: string = sessionStorage.getItem('accessToken')!;
      let new_travelPackage: any = travelPackage;
      new_travelPackage.user = 1; // Can't fetch the user id from the backend
      console.warn("Custom package sent", new_travelPackage);
      this.addTravelPackageSynchronous(new_travelPackage, authToken).then((data) => {
        this._result =  data;

        if (this._result.error) {
          console.warn("Error adding custom package", this._result.error.message);
          this.check_error = true;
        }
        else{
          console.warn("Custom package added", this._result);
          this.travelPackageId = this._result.id;
        }
      });

      }
    else{
      this.travelPackageId = travelPackage.id;
    }
    }

    async addTravelPackageSynchronous(travelPackage: any, authToken: string) {
      return await lastValueFrom(this.travelPackageService.addTravelPackage(travelPackage, authToken)).then((data) => {
        return data;
      });
    }


}
