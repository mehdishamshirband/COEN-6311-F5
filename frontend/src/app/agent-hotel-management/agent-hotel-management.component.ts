import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HotelBooking, Hotel, Photo } from "../interfaces/booking.interface";

@Component({
  selector: 'app-agent-hotel-management',
  templateUrl: './agent-hotel-management.component.html',
})
export class AgentHotelManagementComponent {
  @Input() hotelBookings: HotelBooking[] = [];
  @Output() hotelBookingsChange = new EventEmitter<HotelBooking[]>();
  editingHotelBooking?: HotelBooking;

  constructor() { }

  initNewHotelBooking(): void {
    this.editingHotelBooking = {
      id: Date.now(),
      hotel: {
        id: Date.now(),
        name: '',
        location: '',
        photo: { url: '', caption: '' },
        website: ''
      },
      checkIn: new Date(),
      checkOut: new Date(),
      totalPrice: 0,
    };
  }

  startEditingHotelBooking(hotelBookingId: number, event: MouseEvent): void {
    event.preventDefault();
    const hotelBooking = this.hotelBookings.find(hb => hb.id === hotelBookingId);
    if (hotelBooking) {
      this.editingHotelBooking = JSON.parse(JSON.stringify(hotelBooking));
    }
  }

  saveHotelBooking(): void {
    if (!this.editingHotelBooking) return;
    const index = this.hotelBookings.findIndex(hb => hb.id === this.editingHotelBooking!.id);
    if (index > -1) {
      this.hotelBookings[index] = this.editingHotelBooking;
    } else {
      this.hotelBookings.push(this.editingHotelBooking);
    }
    this.hotelBookingsChange.emit(this.hotelBookings);
    this.editingHotelBooking = undefined;
  }

  cancelEditingHotelBooking(): void {
    this.editingHotelBooking = undefined;
  }

  deleteHotelBooking(index: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.hotelBookings.splice(index, 1);
    this.hotelBookingsChange.emit(this.hotelBookings);
  }

  handleFileInput(event: any): void {
    if (!this.editingHotelBooking || !this.editingHotelBooking.hotel.photo) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.editingHotelBooking && this.editingHotelBooking.hotel) {
          if (!this.editingHotelBooking.hotel.photo) {
            this.editingHotelBooking.hotel.photo = { url: '', caption: '' };
          }
          this.editingHotelBooking.hotel.photo.url = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
