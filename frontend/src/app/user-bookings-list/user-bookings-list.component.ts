import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import { BookingService } from '../services/booking.service';
import { PaymentType, PaymentState, Booking, Flight, Hotel, Activity, Billing, BookingState, TravelPackage } from '../interfaces/booking.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-bookings-list',
  templateUrl: './user-bookings-list.component.html',
  styleUrl: './user-bookings-list.component.css'
})

export class UserBookingsListComponent implements OnInit {

  bookings: Booking[] = [];


  constructor(private bookingService: BookingService,
              private router: Router) {}

  async ngOnInit() {
    this.bookings = await this.bookingService.getBookingSynchronous();
    console.warn('Bookings:', this.bookings);

  }

  goToBookingDetails(bookingNo: string) {
    let bookingDetail = this.bookings.find(booking => booking.bookingNo === bookingNo);
    void this.router.navigate(['/booking-details', bookingNo], {
        state: bookingDetail
      }
    );
  }
}
