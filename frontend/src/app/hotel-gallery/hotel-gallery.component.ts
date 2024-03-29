  import {Component, EventEmitter, OnInit, Output} from '@angular/core';
  import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
    searchPerformed = false;

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
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
      }
    });
    }

    searchHotels() {
      this.searchPerformed = true;
      const formValue = this.searchForm.value;
      this.hotelService.searchHotels(formValue.location).subscribe({
        next: (results) => {
          this.hotelList = results;
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
      const hotelBooking: HotelBooking = {
        id: hotel.id, // Or generate a unique ID as needed //TODO
        hotel: hotel,
        checkIn: new Date(formValue.checkInDate), // TODO: offset in the date by one day...
        checkOut: new Date(formValue.checkOutDate), // TODO: same
        totalPrice: 1000, // FETCH THE PRICE FROM BACKEND //TODO
      };

      this.journeyService.addHotelBooking(hotelBooking);
      this.hotelAdded.emit(true);
    }

    resetSearch() {
      this.searchForm.reset();
      this.hotelList = [];
      this.searchPerformed = false;
    }

  }
