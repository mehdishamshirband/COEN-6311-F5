import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HotelBooking, Hotel, Photo } from "../interfaces/booking.interface";

@Component({
  selector: 'app-agent-hotel-management',
  templateUrl: './agent-hotel-management.component.html',
  styleUrl: './agent-hotel-management.component.css'
})
export class AgentHotelManagementComponent {
  @Input() hotelBookings: HotelBooking[] = [];
  @Output() hotelBookingsChange = new EventEmitter<HotelBooking[]>();
  editingHotelBooking?: HotelBooking;
  newHotelBooking?: boolean;

  constructor() { }

  initNewHotelBooking(): void {
    this.newHotelBooking = true;
    this.editingHotelBooking = {
      id: Date.now(),
      hotel: {
        id: Date.now(),
        name: '',
        location: '',
        photos: [],//{ url: '', caption: '' },
        website: ''
      },
      checkIn: new Date(),
      checkOut: new Date(),
      totalPrice: 0,
    };
  }

  startEditingHotelBooking(hotelBookingId: number, event: MouseEvent): void {
    event.preventDefault();
    this.newHotelBooking = false;
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

  addPhotoField(): void {
    if (this.editingHotelBooking && this.editingHotelBooking!.hotel.photos!.length < 5) {
      this.editingHotelBooking!.hotel.photos!.push({ url: '', caption: '' });
    }
  }

  removePhoto(index: number): void {
    if (this.editingHotelBooking && this.editingHotelBooking.hotel.photos) {
      this.editingHotelBooking.hotel.photos.splice(index, 1);
    }
  }

  handleFileInput(event: any, index: number): void {
    if (!this.editingHotelBooking || !this.editingHotelBooking.hotel.photos) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editingHotelBooking!.hotel.photos![index].url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }


}
