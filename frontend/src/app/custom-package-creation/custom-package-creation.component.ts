import { Component } from '@angular/core';
import { JourneyService } from '../services/journey.service';
import { CommonModule } from '@angular/common';
import { FlightGalleryComponent } from "../flight-gallery/flight-gallery.component";
import { HotelGalleryComponent } from "../hotel-gallery/hotel-gallery.component";
import { ActivityGalleryComponent } from "../activity-gallery/activity-gallery.component";
import { DatePipe } from "@angular/common";
import {AppModule} from "../app.module";
import {MinToHoursMinPipe} from "../min-to-hours-min.pipe";
import {
  Activity,
  Flight,
  HotelBooking,
  NbrPerson,
  NewTravelPackage,
  TravelPackage
} from "../interfaces/booking.interface";
import {JourneyItem} from "../interfaces/booking.interface";
import {CartService} from "../services/cart.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

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
    MinToHoursMinPipe,
    FormsModule
  ],
  styleUrls: ['./custom-package-creation.component.css']
})

export class CustomPackageCreationComponent {

  showFlightSearch = false;
  showHotelSearch = false;
  showActivitySearch = false;

  text_button = 'Add Flight\nAdd Hotel\nAdd Activity';

  nbrPerson = this.cartService.user_cart_nbr_person(0);

  constructor(public journeyService: JourneyService,
              private cartService: CartService,
              private router: Router) {}

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

  trackByItemId(index: number, item: any): number {
    return item.id;
  }

get sortedJourneyItems() {
  const flights = this.journeyService.flights.map(item => ({ ...item, type: 'flight', sortDate: item.departureDate }));
  const hotels = this.journeyService.hotels.map(item => ({ ...item, type: 'hotel', sortDate: item.checkIn }));
  const activities = this.journeyService.activities.map(item => ({ ...item, type: 'activity', sortDate: item.date }));

  const allItems = [...flights, ...hotels, ...activities];

  allItems.sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime());

  return allItems;
}


calculateTotalPrice() {
  let totalPrice = 0;
  this.journeyService.flights.forEach(f => totalPrice += f.price);
  this.journeyService.hotels.forEach(h => totalPrice += h.totalPrice);
  this.journeyService.activities.forEach(a => totalPrice += a.price);
  return totalPrice;
}

earliestFlight() {
  if (this.journeyService.flights.length === 0) {
    return null;
  }
  return this.journeyService.flights.reduce((a, b) => a.departureDate < b.departureDate ? a : b);
}

latestFlight() {
  if (this.journeyService.flights.length === 0) {
    return null;
  }
  return this.journeyService.flights.reduce((a, b) => a.arrivalDate > b.arrivalDate ? a : b);
}


addToCart(): void {
    let rnd = Math.floor(Math.random() * 10000);
    let custom_travel_package: TravelPackage = {
      id: rnd,
      name: "Your perfect journey",
      description: "Your perfect journey",
      price: this.calculateTotalPrice(),
      flights: this.journeyService.flights,
      hotels: this.journeyService.hotels,
      activities: this.journeyService.activities,
      startingDate: this.earliestFlight()!.departureDate,
      endingDate: this.latestFlight()!.arrivalDate,
    }
    this.nbrPerson.id = rnd;

    //this.cartService.localAddToCart(custom_travel_package, this.nbrPerson);
    //this.journeyService.emptyJourney();
    //void this.router.navigate(['/cart']);

  }


}
