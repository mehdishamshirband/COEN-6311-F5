import {EventEmitter, Injectable} from '@angular/core';
import { TravelPackage } from '../interfaces/booking.interface';


@Injectable({
  providedIn: 'root'
})
export class CartService {

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
