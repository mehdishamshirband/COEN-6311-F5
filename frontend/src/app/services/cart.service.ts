import {EventEmitter, Injectable} from '@angular/core';
import {NbrPerson, TravelPackage} from '../interfaces/booking.interface';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  get user_cart(): any {
    return JSON.parse(localStorage.getItem('localCart')!);
  }

  get cart_total(): number {
    // Compute the total price of the cart
    return this.user_cart.reduce((acc: number, item: any) => acc + item.price, 0).toFixed(2);
  }

  cart_total_parameter(user_cart: any): number {
    // Compute the total price of the cart
    return user_cart.reduce((acc: number, item: any) => acc + item.price, 0);
  }

  clearLocalCart() {
    localStorage.setItem('localCart', JSON.stringify([]));
    this.cartData.emit([])
    localStorage.setItem('localCartNbrPerson', JSON.stringify([]));
    this.cardDataNbrPerson.emit([])
  }

  localRemoveToCart(id: number): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    this.localRemoveToCartNbrPerson(id);
    if (localCart) {
      cartData = JSON.parse(localCart);
      cartData = cartData.filter((item: TravelPackage) => item.id !== id);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  cartData = new EventEmitter<TravelPackage[]|[]>(); // Event emitter to emit the cart data
  cardDataNbrPerson = new EventEmitter<NbrPerson[]|[]>();
  localAddToCart(data: TravelPackage, nbrPerson: NbrPerson): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    this.localAddToCartNbrPerson(nbrPerson, data.id);
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

  localAddToCartNbrPerson(data: NbrPerson, id: number): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCartNbrPerson');
    data.id = id;
    if (!localCart) {
      localStorage.setItem('localCartNbrPerson', JSON.stringify([data]));
    }
    else{
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCartNbrPerson', JSON.stringify(cartData));
      this.cardDataNbrPerson.emit(cartData);
    }
  }

  localRemoveToCartNbrPerson(id: number): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCartNbrPerson');
    if (localCart) {
      cartData = JSON.parse(localCart);
      cartData = cartData.filter((item: NbrPerson) => item.id !== id);
      localStorage.setItem('localCartNbrPerson', JSON.stringify(cartData));
      this.cardDataNbrPerson.emit(cartData);
    }
  }

  user_cart_nbr_person(id: number): NbrPerson {
    let cartData = [];
    let localCart = localStorage.getItem('localCartNbrPerson');
    if (localCart) {
      cartData = JSON.parse(localCart);
      cartData = cartData.filter((item: NbrPerson) => item.id === id);
      if (cartData.length > 0){ return cartData[0]; }
      else{ return {nbr_adult: 2, nbr_child: 0, id: 0}; } // Enable to initialize the cart
    }
    else{
      return {nbr_adult: 2, nbr_child: 0, id: 0}; // Value by default
    }
  }



}
