// booking.service.ts
import { Injectable } from '@angular/core';
import {Booking, PaymentType, PaymentState, BookingState, TravelPackage} from '../interfaces/booking.interface'
import {HttpClient} from "@angular/common/http";
import {Observable, lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class BookingService {

  /*
  // Sample bookings array
  private bookings: Booking[] = [
    {
      id: 1,
      bookingNo: 'C01242694559',
      cost: 2875,
      purchaseDate: new Date('2024-02-25'),
      billing: {
        id: 1,
        paymentType: PaymentType.Visa,
        paymentState: PaymentState.FirstDeposit,
        firstName: 'Benjamin',
        lastName: 'Vauchel',
        firstLineAddress: '2850 avenue Jean-Jaurès',
        secondLineAddress: '',
        zipCode: 'H28 1A5',
        city: 'Montreal',
        state_area: 'QC',
        country: 'Canada'
      },
      bookingState: BookingState.Processing,
      travelPackage: {
        id: 1,
        name: 'Adventure in Italy',
        description: 'Experience the beauty and history of Italy with this comprehensive package.',
        price: 2500,
        startingDate: new Date('2024-04-20'),
        endingDate: new Date('2024-04-27'),
        nbr_adult: 2,
        nbr_child: 0,
        photos: [{url: 'assets/images/travel-packages/rome.jpg'}],
        flights: [
          {
            id: 101,
            departureAirport: 'JFK',
            departureCity: 'New York City',
            departureCountry: 'United States of America',
            arrivalAirport: 'FCO',
            arrivalCity: 'Rome',
            arrivalCountry: 'Italy',
            departureDate: new Date(2024, 4, 20, 17, 31),
            arrivalDate: new Date(2024, 4, 21, 6, 28),
            airline: 'United Airlines',
            price: 449,
            duration: 492
          }
        ],
        hotels: [
          {
            id: 201,
            hotel: {
              id: 201,
              name: 'Hotel Roma',
              location: 'Rome, Italy'
            },
            checkIn: new Date('2024-04-21'),
            checkOut: new Date('2024-04-25'),
            totalPrice: 320
          },
          {
            id: 204,
            hotel: {
              id: 204,
              name: 'Hotel Mercurio Venezia',
              location: 'Venice, Italy',
              website: 'https://www.hotelmercurio.com/',
              photos: [{url: 'assets/images/hotels/mercurio_venezia.jpg', caption: 'Mecurio Venezia'}]
            },
            checkIn: new Date('2024-04-25'),
            checkOut: new Date('2024-04-27'),
            totalPrice: 270,
          }
        ],
        activities: [
          {
            id: 301,
            name: 'Colosseum Guided Tour',
            type: 'Guided Tour',
            description: 'This guided tour of the Colosseum...',
            location: 'Rome, Italy',
            date: new Date('2024-04-22'),
            price: 19,
            photos: [{url: 'assets/images/activities/colosseum-tour.jpg'}]
          },
          {
            id: 302,
            name: 'Venice Food Experience',
            type: 'Food Experience',
            description: 'Experience authentic Venetian cuisine...',
            location: 'Venice, Italy',
            date: new Date('2024-04-24'),
            price: 49,
            photos: [{url: 'assets/images/activities/venice-food-experience.jpg'}],
          }
        ]
      },
      firstName: 'Benjamin',
      lastName: 'Vauchel',
      firstLineAddress: '2850 avenue Jean-Jaurès',
      secondLineAddress: '',
      zipCode: 'H28 1A5',
      city: 'Montreal',
      state_area: 'QC',
      country: 'Canada',
      email: 'b_vauche@live.concordia.ca',
      phone: '(438) 238-2245'
    },
      {
    id: 2,
    bookingNo: "C05497514584",
    cost: 2953,
    purchaseDate: new Date('2024-02-15'),
    billing: {
      id: 2,
      paymentType: PaymentType.Visa,
      paymentState: PaymentState.FirstDeposit,
      firstName: 'Alice',
      lastName: 'Johnson',
      firstLineAddress: '1234 Calle Vista',
      secondLineAddress: '',
      zipCode: '28001',
      city: 'Madrid',
      state_area: 'Madrid',
      country: 'Spain',
    },
    bookingState: BookingState.Confirmed,
    travelPackage: {
      id: 2,
      name: 'Landscapes of Spain',
      description: 'Immerse yourself in the vibrant culture and stunning landscapes of Spain. Explore historic cities, enjoy delicious cuisine, and experience the famous Spanish nightlife.',
      price: 2953,
      startingDate: new Date(2024, 4, 30),
      endingDate: new Date(2024, 5, 10),
      nbr_adult: 3,
      nbr_child: 1,
      photos: [{url: 'assets/images/travel-packages/madrid.jpg'}],
      flights: [
        {
          id: 201,
          departureAirport: 'JFK',
          departureCity: 'New York City',
          departureCountry: 'United States',
          arrivalAirport: 'MAD',
          arrivalCity: 'Madrid',
          arrivalCountry: 'Spain',
          departureDate: new Date(2024, 4, 30, 18, 55),
          arrivalDate: new Date(2024, 5, 1, 6, 59),
          airline: 'Iberia',
          price: 500,
          duration: 472
        },
        {
          id: 202,
          departureAirport: 'MAD',
          departureCity: 'Madrid',
          departureCountry: 'Spain',
          arrivalAirport: 'JFK',
          arrivalCity: 'New York City',
          arrivalCountry: 'United States',
          departureDate: new Date(2024, 5, 10, 21, 18),
          arrivalDate: new Date(2024, 5, 11, 12, 41),
          airline: 'Iberia',
          price: 500,
          duration: 597
        }
      ],
      hotels: [
        {
          id: 301,
          hotel: {
            id: 301,
            name: 'Hotel Madrid Centro',
            location: 'Madrid, Spain',
            photos: [{url: 'assets/images/hotels/hotel_madrid_centro.jpg', caption:'Hotel Madrid Centro'}]
          },
          checkIn: new Date('2024-05-01'),
          checkOut: new Date('2024-05-05'),
          totalPrice: 600
        },
        {
          id: 302,
          hotel: {
            id: 302,
            name: 'Hotel Best Front Maritim Barcelona',
            location: 'Barcelona, Spain',
            photos: [{url: 'assets/images/hotels/hotel_best_front_maritim_barcelona.jpg', caption: 'Hotel Barcelona'}]
          },
          checkIn: new Date('2024-05-05'),
          checkOut: new Date('2024-05-10'),
          totalPrice: 850,
        }
      ],
      activities: [
        {
          id: 401,
          name: 'Guided Tour of the Prado Museum',
          type: 'Guided Tour',
          description: 'Explore Spain\'s premier art museum with an expert guide.',
          location: 'Madrid, Spain',
          date: new Date('2024-05-02'),
          price: 30,
          photos: [{url: 'assets/images/activities/prado_museum.jpg'}]
        },
        {
          id: 402,
          name: 'Flamenco Night',
          type: 'Cultural Experience',
          description: 'Enjoy an authentic Flamenco performance in the heart of Barcelona.',
          location: 'Barcelona, Spain',
          date: new Date('2024-05-07'),
          price: 45,
          photos: [{url: 'assets/images/activities/flamenco_night.jpg'}]
        }
      ]
    },
    firstName: 'Alice',
    lastName: 'Johnson',
    firstLineAddress: '1234 Calle Vista',
    secondLineAddress: '',
    zipCode: '28001',
    city: 'Madrid',
    state_area: 'Madrid',
    country: 'Spain',
    email: 'alice.johnson@example.com',
    phone: '(555) 123-4567'
  },
    {
    id: 3,
    bookingNo: 'C01245201245',
    cost: 12979,
    purchaseDate: new Date('2024-01-10'),
    billing: {
      id: 3,
      paymentType: PaymentType.Visa,
      paymentState: PaymentState.FirstDeposit,
      firstName: 'Alice',
      lastName: 'Johnson',
      firstLineAddress: '123 Alpine Road',
      secondLineAddress: '',
      zipCode: '90001',
      city: 'Zurich',
      state_area: 'Zurich',
      country: 'Switzerland'
    },
    bookingState: BookingState.Confirmed,
    travelPackage: {
      id: 3,
      name: 'Hiking in the Swiss Alps',
      description: "Discover the majestic beauty of the Swiss Alps. Enjoy scenic hikes, luxury ski resorts, and the serene ambiance of Switzerland's picturesque villages.",
      price: 12979,
      startingDate: new Date('2024-12-11'),
      endingDate: new Date('2024-12-19'),
      nbr_adult: 10,
      nbr_child: 10,
      photos: [{url: 'assets/images/travel-packages/alps_winter.jpg'}],
      flights: [
        {
          id: 301,
          departureAirport: 'JFK',
          departureCity: 'New York',
          departureCountry: 'United States',
          arrivalAirport: 'ZRH',
          arrivalCity: 'Zurich',
          arrivalCountry: 'Switzerland',
          departureDate: new Date(2024, 12, 10, 17, 49),
          arrivalDate: new Date(2024, 12, 11, 8, 57),
          airline: 'Swiss International Air Lines',
          price: 600,
          duration: 469
        }
      ],
      hotels: [
        {
          id: 301,
          hotel: {
            id: 301,
            name: 'Badrutt\'s Palace Hotel',
            location: 'St. Moritz, Switzerland',
            photos: [{url: 'assets/images/hotels/hotel_badrutts_palace.jpg', caption: 'Badrutt\'s Palace Hotel'}]
          },
          checkIn: new Date('2024-12-11'),
          checkOut: new Date('2024-12-19'),
          totalPrice: 7200,
        }
      ],
      activities: [
        {
          id: 301,
          name: 'Guided Hike of the Matterhorn',
          type: 'Guided Tour',
          description: 'A day-long guided hike around the iconic Matterhorn, exploring its surrounding beauty.',
          location: 'Zermatt, Switzerland',
          date: new Date('2024-12-12'),
          price: 150,
          photos: [{url: 'assets/images/activities/matterhorn_hike.png'}]
        },
        {
          id: 302,
          name: 'Visit to Chillon Castle',
          type: 'Sightseeing',
          description: 'Explore the historic Chillon Castle on Lake Geneva with a half-day tour.',
          location: 'Montreux, Switzerland',
          date: new Date('2024-12-14'),
          price: 40,
          photos: [{url: 'assets/images/activities/Chillon-castle-winter.jpg'}]
        }
      ]
    },
    firstName: 'Alice',
    lastName: 'Johnson',
    firstLineAddress: '123 Alpine Road',
    secondLineAddress: '',
    zipCode: '90001',
    city: 'Zurich',
    state_area: 'Zurich',
    country: 'Switzerland',
    email: 'alice.johnson@example.com',
    phone: '555-0102'
  },
    // MORE BOOKINGS HERE
  ];
  */
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8000/';

  getBookings(): Observable<Booking[]> { //Observable<TravelPackage[]> {
    return this.http.get<Booking[]>(this.baseUrl + 'Booking/');
    //return this.bookings;
  }

  async getBookingSynchronous() {
    return await lastValueFrom(this.getBookings()).then((bookings) => {
      return bookings;
    });
  }

  getBookingByNo(bookingNo: string): Booking | undefined {
    //return this.bookings.find(booking => booking.bookingNo === bookingNo);
    return undefined;
  }


}
