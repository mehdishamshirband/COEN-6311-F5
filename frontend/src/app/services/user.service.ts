import { Injectable } from '@angular/core';
import { User, UserLogin, UserRegister, UserForgetPassword, UserResetPassword } from '../interfaces/user.interface';
import {lastValueFrom, Observable, of} from "rxjs";
import {TravelPackage} from "../interfaces/booking.interface";
import { HttpClient } from '@angular/common/http';
import { EMPTY } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userSample: User = {
    id: 123456789,
    email: 'b_vauche@live.concordia.ca',
    firstName: 'Benjamin',
    lastName: 'Vauchel',
    birthDate: new Date(2001,5,31),
    phone: '4387381234',
    country: 'Canada',
    province: 'Quebec',
    city: 'Montreal',
    zipcode: 'H2A 3A5'
  };
  constructor(private http: HttpClient) { }

  baseUrl = 'http://127.0.0.1:8000'

  getUserSample(): User {
    return this.userSample;
  }

  noEmptyNames(firstName: string, lastName: string) {
    return firstName.length > 0 && lastName.length > 0;
  }

  validateEmail(email: string)  {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  validatePassword(password: string) {
    //const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    //return re.test(password);
    return true
  }

  validatePasswordMatch(password: string, confirmPassword: string) {
    return password === confirmPassword;
  }

  validatePhone(phone: string) {
    const re = /^\d{10}$/;
    return re.test(phone);
  }

  createUser(user: UserRegister): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/registration/`, user);
  }

  postToken(user: UserLogin): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/token/`, user);
  }

  getUserInfo(token: string): Observable<User> {
    return EMPTY // Can't fetch user info from the backend
    // return this.http.post<User>(`${this.baseUrl}/api-auth/`, token);
  }

  forgetPassword(userData: UserForgetPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}/passwordreset/`, userData);
  }

  resetPassword(userData: UserResetPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}/passwordupdate/`, userData);
  }
}
