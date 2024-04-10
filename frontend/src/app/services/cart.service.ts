import {EventEmitter, Injectable} from '@angular/core';
import { TravelPackage } from '../interfaces/booking.interface';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  get user_cart(): any {
    return JSON.parse(localStorage.getItem('localCart')!);
  }

  get cart_total(): number {
    // Compute the total price of the cart
    return this.user_cart.reduce((acc: number, item: any) => acc + item.price, 0);
  }

  clearLocalCart() {
    localStorage.setItem('localCart', JSON.stringify([]));
  }

  localRemoveToCart(id: number): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (localCart) {
      cartData = JSON.parse(localCart);
      cartData = cartData.filter((item: TravelPackage) => item.id !== id);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  cartData = new EventEmitter<TravelPackage[]|[]>(); // Event emitter to emit the cart data
  localAddToCart(data: TravelPackage): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
    }
    else{
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }

  }
}
