import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import { NgIf } from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { GuestProfile } from '../interfaces/user.interface';
import { CheckoutService } from '../services/checkout.service';
import { Router } from '@angular/router';
import { CartService } from "../services/cart.service";


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  constructor(private checkoutService: CheckoutService,
              private router: Router,
              public cartService: CartService) {}

  isLogged: boolean = false;
  showLogin: boolean = true;
  rightGuestData: boolean = true;


  guestProfile: GuestProfile = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    state_area: '',
    city: '',
    zipCode: '',
    firstLineAddress: '',
    secondLineAddress: ''
  }

  ngOnInit() {
    this.checkoutService.clearLocalStoreGuestData();
    this.alreadyLogged();
  }

  alreadyLogged() {
    this.isLogged = sessionStorage.getItem('accessToken') !== null;
    if (this.isLogged) {
      //TODO retrieve data from user account
    }
  }

  goToLogin() {
    void this.router.navigate(['/login'], {state: {checkout: true}});
  }

  continueAsGuest() {
    this.showLogin = false;
  }

  CheckEmptyFields() {
    if (!this.guestProfile.firstName || !this.guestProfile.lastName || !this.guestProfile.email || !this.guestProfile.country || !this.guestProfile.state_area || !this.guestProfile.city || !this.guestProfile.zipCode || !this.guestProfile.firstLineAddress) {
      alert('Please fill all the required fields');
      this.rightGuestData = false;
    }
  }

  checkEmail() {
    if (this.guestProfile.email){
      if (!(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/).test(this.guestProfile.email)){
        alert('Please enter a valid email address');
        this.rightGuestData = false;
      }
    }
  }

  checkPhone() {
    if (this.guestProfile.phone){
      if (this.guestProfile.phone.length < 8 ||
        (!(/^([0-9]{7,14})$/).test(this.guestProfile.phone) && !(/^(\+[0-9]{1,14})$/).test(this.guestProfile.phone))){
        alert('Please enter a valid phone number');
        this.rightGuestData = false;
      }
    }
  }

  continueToPayment() {
    // TODO Change alert to red text in the form
    this.rightGuestData = true;
    this.CheckEmptyFields();
    this.checkEmail();
    this.checkPhone();
    if (this.rightGuestData) {
      console.warn("Guest data:", this.guestProfile);
      this.checkoutService.localStoreGuestData(this.guestProfile);
      void this.router.navigate(['/payment']);
    }


  }

}
