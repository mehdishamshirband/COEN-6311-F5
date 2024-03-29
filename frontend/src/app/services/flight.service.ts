import {EventEmitter, Injectable} from '@angular/core';
import {Flight, TravelPackage} from '../interfaces/booking.interface';
import {map, Observable, of} from "rxjs";
import { HttpClient} from "@angular/common/http";
import { DatePipe } from "@angular/common";


@Injectable({
  providedIn: 'root'
})
export class FlightService {

    private flights: Flight[] = []

    constructor(private http: HttpClient) { }

    private baseUrl = 'http://127.0.0.1:8000/';
  getAllFlights(): Observable<Flight[]> {
      return this.http.get<Flight[]>(this.baseUrl + 'Flight/');
    //return this.flights;
  }

  searchFlights(departure: string, arrival: string, departureDate: Date): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.baseUrl + 'searchFlights/', {params: {departure: departure, arrival: arrival, departureDate: departureDate.toString()||''}});
    /*.pipe(
      map((flights:any) => {
        flights.departureDate = new Date(flights.departureDate);
        return flights;
      })
    )*/
  }

  /*
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
  */

}
