import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import { BookingService } from '../services/booking.service';
import { PaymentType, PaymentState, Booking, Flight, Hotel, Activity, Billing, BookingState } from '../interfaces/booking.interface';

@Component({
  selector: 'app-user-bookings-list',
  templateUrl: './user-bookings-list.component.html',
  styleUrl: './user-bookings-list.component.css'
})

export class UserBookingsListComponent implements OnInit {

  /***
  travelPackages: TravelPackage[]= [{
    id: 1,
    name: 'Adventure in Italy',
    description: 'Experience the beauty and history of Italy',
    price: 1899,
    startingDate: new Date('04/24/2024'),
    endingDate: new Date('05/05/2024'),
    photos: [
      {
        url: 'assets/images/travel-packages/rome.jpg'
      }
    ],
    bookingNo: "C01242694559"
  },
  {
    id: 2,
    name: 'Landscapes of Spain',
    description: 'Immerse yourself in the vibrant culture and stunning landscapes of Spain. Explore historic cities, enjoy delicious cuisine, and experience the famous Spanish nightlife.',
    price: 2953,
    startingDate: new Date(2024, 4, 30),
    endingDate: new Date(2024, 5, 10, ),
    photos: [{url: 'assets/images/travel-packages/madrid.jpg'}],
    bookingNo: "C05497514584"
},
{
  id: 3,
  name: 'Hiking in the Swiss Alps',
  description: "Discover the majestic beauty of the Swiss Alps. Enjoy scenic hikes, luxury ski resorts, and the serene ambiance of Switzerland's picturesque villages.",
  price: 2979,
  startingDate: new Date(2024, 12, 11),
  endingDate: new Date(2024, 12, 19),
  photos: [{url: 'assets/images/travel-packages/alps.jpg'}],
  bookingNo: "C01245201245"
},
{
  id: 4,
  name: 'Ancient ruins and tropical beaches of Mexico',
  description: 'Embark on a journey through the ancient ruins and tropical beaches of Mexico. Uncover the mysteries of the Mayans and relax on the white sands of the Caribbean coast.',
  price: 2569,
  startingDate: new Date(2024, 9, 13),
  endingDate: new Date(2024, 9, 22),
  photos: [{url: 'assets/images/travel-packages/tulum.jpg'}],
  bookingNo: "C0124513301"
},
{
  id: 5,
  name: 'Japan island 2-week tour',
  description: 'Experience the eclectic mix of modernity and tradition in Japan. Visit ancient temples, witness the cherry blossoms, and explore the bustling city life of Tokyo.',
  price: 2625,
  startingDate: new Date(2024, 6, 19),
  endingDate: new Date(2024, 7, 1),
  photos: [{url: 'assets/images/travel-packages/kyoto.jpg'}],
  bookingNo: "C01245421356"
},
{
  id: 6,
  name: 'Safari adventure in Kenya',
  description: 'Take an unforgettable safari adventure in Kenya. Witness the incredible wildlife, explore the savannahs, and learn about the rich cultural heritage of the Maasai people.',
  price: 2071,
  startingDate: new Date(2024, 11, 17),
  endingDate: new Date(2024, 11, 27),
  photos: [{url: 'assets/images/travel-packages/safari.jpg'}],
  bookingNo: "C01211497054"
}

  ];***/

  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookings = this.bookingService.getBookings();
  }




}
