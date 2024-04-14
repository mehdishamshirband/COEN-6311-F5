  import {Component, EventEmitter, OnInit, Output} from '@angular/core';
  import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
  import { Hotel, HotelBooking } from '../interfaces/booking.interface';
  import { HotelService } from "../services/hotel.service";
  import { CommonModule } from "@angular/common";
  import { JourneyService } from "../services/journey.service";

  @Component({
    selector: 'app-hotel-gallery',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './hotel-gallery.component.html',
    styleUrls: ['./hotel-gallery.component.css']
  })
  export class HotelGalleryComponent implements OnInit {
    searchForm: FormGroup;
    hotelList: Hotel[] = [];
    hotelBookingList: HotelBooking[] = []
    searchPerformed = false;
    pricePerNight: number[] = [];

    @Output() hotelAdded = new EventEmitter<boolean>();

    constructor(private fb: FormBuilder, private hotelService: HotelService, private journeyService: JourneyService) {
      this.searchForm = this.fb.group({
        location: ['', Validators.required],
        checkInDate: ['', Validators.required],
        checkOutDate: ['', Validators.required],
      });
    }

    ngOnInit() {
      this.hotelService.getAllHotels().subscribe({ next: (hotels) => {
        this.hotelList = hotels;
        console.warn('Hotels:', hotels);
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
      }
    });

      for (let i = 0; i < 500; i++) {
        this.pricePerNight[i] = Math.floor(Math.random() * (180 - 60 + 1)) + 60;
      }
      console.log("pricePerNights: ", this.pricePerNight);
    }



    searchHotels() {
      this.searchPerformed = true;
      const formValue = this.searchForm.value;
      void this.hotelService.searchHotels(formValue.location, formValue.checkInDate, formValue.checkOutDate).subscribe({
        next: (results) => {
          this.hotelBookingList = results;
          // Have to go with HotelBooking because it stores the dates and has the hotel object nested inside
          this.hotelList = this.hotelBookingList.flatMap(hotelBooking => hotelBooking.hotel)

          console.warn('Results:', this.hotelList);
          this.searchPerformed = true;
        },
        error: (error) => {
          console.error('Error fetching hotels:', error);
          // Show a message to user //TODO
        }
      });
    }

     addToJourney(hotel: Hotel) {
      const formValue = this.searchForm.value;
      const checkIn = new Date(formValue.checkInDate);
      const checkOut = new Date(formValue.checkOutDate);
      const hotelBooking: HotelBooking = {
        id: hotel.id,
        hotel: hotel,
        checkIn: checkIn,
        checkOut: checkOut,
        totalPrice: Math.round((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000) * this.pricePerNight[hotel.id])
      };

      this.journeyService.addHotelBooking(hotelBooking);
      this.hotelAdded.emit(true);
    }

    resetSearch() {
      this.searchForm.reset();
      this.ngOnInit();
      this.searchPerformed = false;
    }

  }
