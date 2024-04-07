import { Component } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgForOf, NgIf} from "@angular/common";
import {TravelPackageItemComponent} from "../travel-package-item/travel-package-item.component";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgForOf,
    TravelPackageItemComponent,
    NgIf,
    RouterModule,
    DatePipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  get user_cart(): any {
    return JSON.parse(localStorage.getItem('localCart')!);
  }

  get cart_total(): number {
    // Compute the total price of the cart
    return this.user_cart.reduce((acc: number, item: any) => acc + item.price, 0);
  }

}
