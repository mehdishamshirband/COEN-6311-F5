import { Injectable } from '@angular/core';
import {Flight, Hotel, HotelBooking} from '../interfaces/booking.interface';
import { Observable, of } from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private hotels: Hotel[] = [
    {
      id: 1,
      name: "Hotel Sunshine",
      location: "Malaga, Spain",
      photo: { url: 'assets/images/hotels/hotel_sunshine_malaga.jpg' },
      website: "http://hotelsunshine.com"
    },
    {
      id: 2,
      name: "Mountain Retreat",
      location: "Alexandria, United States of America",
      photo: { url: 'assets/images/hotels/mountain-retreat-hotel.jpg' },
      website: "http://mountainretreat.com"
    }
  ];

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://127.0.0.1:8000/';
  getAllHotels(): Observable<Hotel[]> {
      return this.http.get<Hotel[]>(this.baseUrl + 'Hotel/');
    //return this.hotels;
  }


  searchHotels(location: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.baseUrl + 'Hotel/', {params: {departureCity: location}});

    //const results = this.hotels.filter(hotel => hotel.location.toLowerCase().includes(location.toLowerCase()));
    //return of(results);
  }
}
