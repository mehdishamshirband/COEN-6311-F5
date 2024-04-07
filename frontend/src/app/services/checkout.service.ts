import {EventEmitter, Injectable} from '@angular/core';
import { GuestProfile } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService{

  clearLocalStoreGuestData() {
    localStorage.setItem('guestData', JSON.stringify([]));
  }

  localStoreGuestData(data: GuestProfile): void {
    localStorage.setItem('guestData', JSON.stringify([data]));
  }




}
