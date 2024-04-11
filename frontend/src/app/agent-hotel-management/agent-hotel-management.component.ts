import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {HotelBooking, Hotel, Photo, NewHotelBooking} from "../interfaces/booking.interface";
import {UploadService} from "../services/upload.service";

@Component({
  selector: 'app-agent-hotel-management',
  templateUrl: './agent-hotel-management.component.html',
  styleUrl: './agent-hotel-management.component.css'
})
export class AgentHotelManagementComponent implements OnInit {
  @Input() hotelBookings: NewHotelBooking[] = [];
  @Output() hotelBookingsChange = new EventEmitter<NewHotelBooking[]>();
  editingHotelBooking?: NewHotelBooking;
  newHotelBooking?: NewHotelBooking;
  newHotelBookingCheck?: boolean;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.newHotelBookingCheck = false;
  }

  get currentHotelBooking(): any {
    return this.newHotelBookingCheck ? this.newHotelBooking : this.editingHotelBooking;
  }

  initNewHotelBooking(): void {
    this.newHotelBookingCheck = true;
    this.newHotelBooking = {
      id: Date.now(),
      hotel: {
        id: Date.now(),
        name: '',
        location: '',
        photos: [],
        photo_ids: [],
        website: ''
      },
      checkIn: new Date(),
      checkOut: new Date(),
      totalPrice: 0,
    };
  }

  startEditingHotelBooking(hotelBookingId: number, event: MouseEvent): void {
    event.preventDefault();
    this.newHotelBookingCheck = false;
    const hotelBooking = this.hotelBookings.find(hb => hb.id === hotelBookingId);
    if (hotelBooking) {
      this.editingHotelBooking = JSON.parse(JSON.stringify(hotelBooking));
    }
  }

  saveHotelBooking(): void {
    if (this.newHotelBookingCheck && this.newHotelBooking) {
      this.hotelBookings.push(this.newHotelBooking);
    } else if (this.editingHotelBooking) {
      const index = this.hotelBookings.findIndex(hb => hb.id === this.editingHotelBooking!.id);
      if (index > -1) {
        this.hotelBookings[index] = this.editingHotelBooking;
      } else {
        this.hotelBookings.push(this.editingHotelBooking);
      }
      this.hotelBookingsChange.emit(this.hotelBookings);
      this.editingHotelBooking = undefined;
    }
    this.hotelBookingsChange.emit(this.hotelBookings);
    this.editingHotelBooking = undefined;
    this.newHotelBookingCheck = false;
    this.newHotelBooking = undefined;
  }

  cancelEditingHotelBooking(): void {
    this.editingHotelBooking = undefined;
    this.newHotelBookingCheck = false;
    this.newHotelBooking = undefined;
  }

  deleteHotelBooking(index: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.hotelBookings.splice(index, 1);
    this.hotelBookingsChange.emit(this.hotelBookings);
  }

  addPhotoField(): void {
    if(this.newHotelBookingCheck) {
      if(this.newHotelBooking && this.newHotelBooking!.hotel && this.newHotelBooking!.hotel.photos!.length < 5) {
        this.newHotelBooking!.hotel.photos!.push({url: '', caption: ''});
      }
    }
    if (this.editingHotelBooking && this.editingHotelBooking!.hotel && this.editingHotelBooking!.hotel.photos!.length < 5) {
      this.editingHotelBooking!.hotel.photos!.push({ url: '', caption: '' });
    }
  }

  removePhoto(index: number): void {
    if (this.newHotelBookingCheck && this.newHotelBooking && this.newHotelBooking.hotel) {
      this.newHotelBooking.hotel.photos?.splice(index, 1);
      this.newHotelBooking.hotel.photo_ids?.splice(index, 1);
    }
    console.log(this.newHotelBooking); //TODO: delete these debug lines
    if (this.editingHotelBooking && this.editingHotelBooking.hotel && this.editingHotelBooking.hotel.photos) {
      this.editingHotelBooking.hotel.photos.splice(index, 1);
    }
  }

  handleFileInput(event: any, index: number): void {
    const file = event.target.files[0];
    const uploadDir = 'photos/hotels';
    if (file) {
      this.uploadService.uploadFile(file, uploadDir).subscribe(
  response => {
          if (response.type === 4) { // HttpResponse
            console.log(response);
            const responseBody = response.body;
            if (responseBody.id) {
              if(!this.newHotelBooking?.hotel.photo_ids) {
                this.newHotelBooking!.hotel.photo_ids = [responseBody.id];
              }
              else {
                this.newHotelBooking!.hotel.photo_ids!.push(responseBody.id);
              }
              if (this.newHotelBooking?.hotel.photos) {
                this.newHotelBooking!.hotel.photos[index] = {url: responseBody.url, caption: responseBody.caption};
              }
            }
            console.log(this.newHotelBooking); //TODO: delete these debug lines
          }
        },
  error => {
          console.error("Error during the image upload: ", error);
        }
      );
    }
  }


}
