import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import { BookingService } from '../services/booking.service';
import { PaymentType, PaymentState, Booking, Flight, Hotel, Activity, Billing, BookingState } from '../interfaces/booking.interface';

@Component({
  selector: 'app-user-bookings-list',
  templateUrl: './user-bookings-list.component.html',
  styleUrl: './user-bookings-list.component.css'
})

export class UserBookingsListComponent implements OnInit {

  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookings = this.bookingService.getBookings();
  }




}
