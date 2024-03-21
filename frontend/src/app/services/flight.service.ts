import { Injectable } from '@angular/core';
import {Flight, TravelPackage} from '../interfaces/booking.interface';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FlightService {

    private flights: Flight[] = [
      {
        id: 101,
        departureAirport: "AEX",
        departureCity: "Alexandria",
        departureCountry: "United States of America",
        arrivalAirport: "AGP",
        arrivalCity: "Malaga",
        arrivalCountry: "Spain",
        departureDate: new Date(2024, 8, 4, 6, 47),
        arrivalDate: new Date(2024, 8, 4, 22, 59),
        airline: "American Airlines",
        price: 849,
        duration: 425,
        airlineLogo: 'assets/images/airlines/american-airlines.png'

      },
      {
        id: 102,
        departureAirport: "JAE",
        departureCity: "Jaen",
        departureCountry: "Peru",
        arrivalAirport: "PFM",
        arrivalCity: "Primrose",
        arrivalCountry: "Canada",
        departureDate: new Date(2024, 9, 21, 14, 10),
        arrivalDate: new Date(2024, 9, 21, 19, 34),
        airline: "Some other Airlines",
        price: 670,
        duration: 555,
        airlineLogo: 'assets/images/airlines/american-airlines.png'
      }
    ];

    constructor() { }
  getAllFlights(): Flight[] {
    return this.flights;
  }

  searchFlights(departure: string, arrival: string, departureDate: Date): Observable<Flight[]> {
    const searchDate = new Date(departureDate + 'T00:00:00Z');
    const results = this.flights.filter(flight => (
      (departure.length === 0 || flight.departureAirport.toUpperCase() === departure.toUpperCase() || flight.departureCity.toLowerCase().includes(departure.toLowerCase()) || flight.departureCountry.toLowerCase().includes(departure.toLowerCase())) &&
      (arrival.length === 0 || flight.arrivalAirport.toUpperCase() === arrival.toUpperCase() || flight.arrivalCity.toLowerCase().includes(arrival.toLowerCase()) || flight.arrivalCountry.toLowerCase().includes(arrival.toLowerCase())) &&
      (flight.departureDate.getFullYear() === searchDate.getFullYear()) &&
      (flight.departureDate.getMonth() === searchDate.getMonth()) &&
        (flight.departureDate.getDay() === searchDate.getDay() + 1)
      // or       flight.departureDate.toDateString() === departureDate.toDateString()
    ));
    //console.log("Departure:", departure, "Arrival:", arrival, "Departure Date:", searchDate.toISOString());
    //console.log(this.flights);
    //console.log("Results: ", results);
    return of(results);
  }

}
