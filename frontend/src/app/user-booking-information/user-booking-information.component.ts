import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.booking = history.state;
    console.warn('Booking:', this.booking);
    if (this.booking) {
        this.sortedItems = this.mergeAndSortItems();
      } else {
      console.error('Booking not found with the provided booking number.');
    }

  }

  mergeAndSortItems(): MergedItem[] {
    let mergedItems: MergedItem[] = [];

    if (!this.booking) return [];

    const { flights, hotels, activities } = this.booking.travelPackage;

    flights?.forEach(flight => {
      mergedItems.push({ ...flight, sortDate: new Date(flight.departureDate), type: 'Flight'});
    });

    hotels?.forEach(hotel => {
      mergedItems.push({ ...hotel, sortDate: new Date(hotel.checkIn), type: 'Hotel' });
    });

    activities?.forEach(activity => {
      mergedItems.push({ ...activity, sortDate: new Date(activity.date), type: 'Activity' });
    });

    // Sort by sortDate
    mergedItems.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return mergedItems;
  }

  cancelBooking(id: number): void {
    void this.router.navigate(['/cancelled-booking', this.booking!.bookingNo],
      { state: { booking: this.booking } });
  }

  modifyBooking(id: number): void {

  }
}

