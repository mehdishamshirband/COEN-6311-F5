import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { PaymentType, PaymentState, Booking, Flight, Hotel, Activity, Billing, BookingState, MergedItem } from '../interfaces/booking.interface';

@Component({
  selector: 'app-user-booking-information',
  templateUrl: './user-booking-information.component.html',
  styleUrls: ['./user-booking-information.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class UserBookingInformationComponent implements OnInit {
  booking: Booking | undefined;
  sortedItems: MergedItem[] = [];

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBookingDetails();
  }

  getBookingDetails(): void {
    const bookingNo = this.route.snapshot.paramMap.get('bookingNo');
    if (bookingNo) {
      this.booking = this.bookingService.getBookingByNo(bookingNo);
      if (this.booking) {
        this.sortedItems = this.mergeAndSortItems();
      } else {
        console.error('Booking not found with the provided booking number.');
        // Handle the case where the booking is not found
      }
    } else {
      console.error('No booking number provided in the route parameters.');
      // Handle the missing parameter appropriately, maybe navigate back or show an error message
    }
  }

  mergeAndSortItems(): MergedItem[] {
    let mergedItems: MergedItem[] = [];

    if (!this.booking) return [];

    const { flights, hotels, activities } = this.booking.travelPackage;

    flights?.forEach(flight => {
      mergedItems.push({ ...flight, sortDate: flight.departureDate, type: 'Flight'});
    });

    hotels?.forEach(hotel => {
      mergedItems.push({ ...hotel, sortDate: hotel.checkIn, type: 'Hotel' });
    });

    activities.forEach(activity => {
      mergedItems.push({ ...activity, sortDate: activity.date, type: 'Activity' });
    });

    // Sort by sortDate
    mergedItems.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return mergedItems;
  }
}

