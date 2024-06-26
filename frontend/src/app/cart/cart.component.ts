import { Component } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgForOf, NgIf} from "@angular/common";
import {TravelPackageItemComponent} from "../travel-package-item/travel-package-item.component";
import {RouterModule} from "@angular/router";
import { CartService } from "../services/cart.service";

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
  constructor(private cartService: CartService) {}

  user_cart: any = this.cartService.user_cart;
  cart_total: number = this.cartService.cart_total;

  removeToCart(id: number): void {
    this.cartService.localRemoveToCart(id);
  }

  ngOnInit(): void {
    let cartData = localStorage.getItem('localCart');
    this.cartService.cartData.subscribe((items : any) => {
        this.user_cart = this.cartService.user_cart;
        this.cart_total = this.cartService.cart_total;
      });

  }




}
