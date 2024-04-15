import { Injectable } from '@angular/core';
import {Flight, HotelBooking, Activity, Hotel} from "../interfaces/booking.interface";
@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  private journey: {
    flights: Flight[],
    hotels: HotelBooking[],
    activities: Activity[]
  } = { flights: [], hotels: [], activities: [] };

  constructor() {}

  get flights(): Flight[] {
    return this.journey.flights;
  }

  get hotels(): HotelBooking[] {
    return this.journey.hotels;
  }

  get activities(): Activity[] {
    return this.journey.activities;
  }

   // Immutable way to add items
  addFlight(flight: Flight) {
    this.journey = {
      ...this.journey,
      flights: [...this.journey.flights, flight]
    };
  }

  addHotelBooking(hotelBooking: HotelBooking) {
    this.journey = {
      ...this.journey,
      hotels: [...this.journey.hotels, hotelBooking]
    };
  }

  addActivity(activity: Activity) {
    this.journey = {
      ...this.journey,
      activities: [...this.journey.activities, activity]
    };
  }

  // Immutable way to remove items
    removeFlight(flightId: number) {
      this.journey.flights = this.journey.flights.filter(flight => flight.id !== flightId);
    }

    removeHotel(hotelBookingId: number) {
      this.journey.hotels = this.journey.hotels.filter(hotelBooking => hotelBooking.id !== hotelBookingId);
    }

    removeActivity(activityId: number) {
      this.journey.activities = this.journey.activities.filter(activity => activity.id !== activityId);
    }

  isEmpty(): boolean {
    return this.journey.flights.length === 0 && this.journey.hotels.length === 0 && this.journey.activities.length === 0;
  }

  emptyJourney() {
    this.journey = { flights: [], hotels: [], activities: [] };
  }
}
