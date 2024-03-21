import { Component } from '@angular/core';
import { JourneyService } from '../services/journey.service';
import { CommonModule } from '@angular/common';
import { FlightGalleryComponent } from "../flight-gallery/flight-gallery.component";
import { HotelGalleryComponent } from "../hotel-gallery/hotel-gallery.component";
import { ActivityGalleryComponent } from "../activity-gallery/activity-gallery.component";
import { DatePipe } from "@angular/common";
import {AppModule} from "../app.module";
import {MinToHoursMinPipe} from "../min-to-hours-min.pipe";
import {Activity, Flight, HotelBooking} from "../interfaces/booking.interface";
import {JourneyItem} from "../interfaces/booking.interface";

@Component({
  standalone: true,
  selector: 'app-custom-package-creation',
  templateUrl: './custom-package-creation.component.html',
  imports: [
    CommonModule,
    FlightGalleryComponent,
    HotelGalleryComponent,
    ActivityGalleryComponent,
    DatePipe,
    MinToHoursMinPipe
  ],
  styleUrls: ['./custom-package-creation.component.css']
})

export class CustomPackageCreationComponent {

  showFlightSearch = false;
  showHotelSearch = false;
  showActivitySearch = false;

  constructor(public journeyService: JourneyService) {}

  removeFlight(flightId: number) {
    const index = this.journeyService.flights.findIndex(f => f.id === flightId);
    if (index > -1) {
      this.journeyService.flights.splice(index, 1);
    }
  }

  removeHotel(hotelBookingId: number) {
    const index = this.journeyService.hotels.findIndex(h => h.id === hotelBookingId);
    if (index > -1) {
      this.journeyService.hotels.splice(index, 1);
    }
  }

  removeActivity(activityId: number) {
    const index = this.journeyService.activities.findIndex(a => a.id === activityId);
    if (index > -1) {
      this.journeyService.activities.splice(index, 1);
    }
  }

  toggleHotelSearch() {
    this.showHotelSearch = !this.showHotelSearch;
  }
  toggleFlightSearch() {
    this.showFlightSearch = !this.showFlightSearch;
  }

  toggleActivitySearch() {
    this.showActivitySearch = !this.showActivitySearch;
  }

    trackByFlightId(index: number, flight: Flight): number {
    return flight.id; // Use the unique ID for tracking
  }

  trackByHotelId(index: number, hotelBooking: HotelBooking): number {
    return hotelBooking.id; // Use the unique ID for tracking
  }

  trackByActivityId(index: number, activity: Activity): number {
    return activity.id; // Use the unique ID for tracking
  }

  trackByItemId(index: number, item: any): number {
    return item.id;
  }

/**
get sortedJourneyItems(): JourneyItem[] {
  const flights: JourneyItem[] = this.journeyService.flights.map(item => ({ ...item, type: 'flight' }));
  const hotels: JourneyItem[] = this.journeyService.hotels.map(item => ({ ...item, type: 'hotel' }));
  const activities: JourneyItem[] = this.journeyService.activities.map(item => ({ ...item, type: 'activity' }));

  const allItems: JourneyItem[] = [...flights, ...hotels, ...activities];

  allItems.sort((a, b) => {
    let dateA: Date;
    let dateB: Date;

    switch (a.type) {
      case 'flight':
        dateA = a.departureDate;
        break;
      case 'hotel':
        dateA = a.checkIn;
        break;
      case 'activity':
        dateA = a.date;
        break;
    }

    switch (b.type) {
      case 'flight':
        dateB = b.departureDate;
        break;
      case 'hotel':
        dateB = b.checkIn;
        break;
      case 'activity':
        dateB = b.date;
        break;
    }

    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return allItems;
}
*/

get sortedJourneyItems() {
  const flights = this.journeyService.flights.map(item => ({ ...item, type: 'flight', sortDate: item.departureDate }));
  const hotels = this.journeyService.hotels.map(item => ({ ...item, type: 'hotel', sortDate: item.checkIn }));
  const activities = this.journeyService.activities.map(item => ({ ...item, type: 'activity', sortDate: item.date }));

  const allItems = [...flights, ...hotels, ...activities];

  allItems.sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime());

  return allItems;
}




}
