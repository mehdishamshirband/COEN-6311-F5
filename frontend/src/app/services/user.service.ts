import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import {Observable, of} from "rxjs";
import {TravelPackage} from "../interfaces/booking.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userSample: User = {
    id: 123456789,
    emailAddress: 'b_vauche@live.concordia.ca',
    firstName: 'Benjamin',
    lastName: 'Vauchel',
    birthDate: new Date(2001,5,31),
    phone: '4387381234',
    country: 'Canada',
    province: 'Quebec',
    city: 'Montreal',
    zipcode: 'H2A 3A5'
  };
  constructor() { }
  getUserSample(): User {
    return this.userSample;
  }
}
