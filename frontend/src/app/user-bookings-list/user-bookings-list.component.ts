import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import { BookingService } from '../services/booking.service';
import { PaymentType, PaymentState, Booking, Flight, Hotel, Activity, Billing, BookingState, TravelPackage } from '../interfaces/booking.interface';


@Component({
  selector: 'app-user-bookings-list',
  templateUrl: './user-bookings-list.component.html',
  styleUrl: './user-bookings-list.component.css'
})

export class UserBookingsListComponent implements OnInit {

  bookings: Booking[] = [];


  constructor(private bookingService: BookingService) {}

  async ngOnInit() {
    this.bookings = await this.bookingService.getBookingSynchronous();
    // TODO Debug the fact that travelPackage exists but we can't access it (return undefined)
    console.warn('Bookings:', this.bookings);
    console.warn('AAAAAABookings:', JSON.stringify(this.bookings[0].travelPackage));
    console.warn('BBBBBBookings:', this.bookings[0].travelPackage.id);

  }

}
