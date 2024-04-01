import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Flight } from '../interfaces/booking.interface';
import { FlightService } from "../services/flight.service";
import { JourneyService } from "../services/journey.service";
import { DatePipe } from "@angular/common";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-gallery',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './flight-gallery.component.html',
  styleUrl: './flight-gallery.component.css'
})

export class FlightGalleryComponent implements OnInit {
  searchForm: FormGroup;
  flightList: Flight[] = [];
  searchPerformed = false;

  @Output() flightAdded = new EventEmitter<boolean>();

    constructor(private fb: FormBuilder, private flightService: FlightService, private journeyService: JourneyService) {

      this.searchForm = this.fb.group({
      departure: [''],
      arrival: [''],
      departureDate: [''],
    });
  }

  ngOnInit() {
    this.flightService.getAllFlights().subscribe({ next: (flights) => {
        this.flightList = flights;
        console.warn('Flights:', flights);
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
      }
    });

  }


  searchFlights() {
    this.searchPerformed = true;
    const formValue = this.searchForm.value;
    this.flightService.searchFlights(formValue.departure, formValue.arrival, formValue.departureDate).subscribe({
      next: (results) => {
        this.flightList = results;
        console.warn('Results:', results);
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
        // Show a message to user //TODO
      }
    });
  }

  resetSearch() {
    this.searchForm.reset();
    this.ngOnInit();
    // this.flightList = [];
    this.searchPerformed = false;
  }

   addToJourney(flight: Flight) {
    this.journeyService.addFlight(flight);
    this.flightAdded.emit(true);
  }

  MinToHoursMin(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins}`;
  }

}
