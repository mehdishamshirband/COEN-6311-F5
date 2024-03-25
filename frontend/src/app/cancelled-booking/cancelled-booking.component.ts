import { Component } from '@angular/core';
import { Booking } from  '../interfaces/booking.interface';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cancelled-booking',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cancelled-booking.component.html',
  styleUrl: './cancelled-booking.component.css'
})
export class CancelledBookingComponent {
  booking: Booking | undefined;
  constructor(private router: Router) {
  }
  ngOnInit() {
    this.booking = history.state.booking;
  }

}
