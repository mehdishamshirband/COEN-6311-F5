export interface Photo {
  url: string;
  caption?: string;
}

export enum PaymentType {
  Visa = 'visa',
  Mastercard = 'Mastercard',
  Paypal = 'Paypal',
  Stripe = 'Stripe'
}

export enum PaymentState {
  FirstDeposit = 'firstdeposit',
  SecondDeposit = 'seconddeposit',
  LastDeposit = 'lastdeposit',
}

export enum BookingState {
  Created = 'Created',
  Processing = 'Processing',
  Canceled = 'Canceled',
  Failed = 'Failed',
  Modified = 'Modified',
  Confirmed = 'Confirmed',
  Refunded = 'Refunded'
}

export interface Flight {
  id: number;
  airlineLogo?: string;
  departureAirport: string;
  departureCity: string;
  departureCountry: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalCountry: string;
  departureDate: Date;
  arrivalDate: Date;
  airline: string;
  duration: number;
  price: number;
  stops?: Flight[];
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  photos?: Photo[];
  website?: string;
}

export interface NewHotel {
  id: number;
  name: string;
  location: string;
  photos?: Photo[];
  photo_ids?: number[];
  website?: string;
}

export interface HotelBooking {
  id: number;
  hotel: Hotel;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
}

export interface NewHotelBooking {
  id: number;
  hotel: NewHotel;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
}

export interface Activity {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  date: Date;
  price: number;
  photos?: Photo[];
}

export interface NewActivity {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  date: Date;
  price: number;
  photos?: Photo[];
  photo_ids?: number[];
}

export interface TravelPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  flights?: Flight[];
  hotels?: HotelBooking[];
  activities?: Activity[];
  startingDate: Date;
  endingDate: Date;
  photos?: Photo[];
}

export interface NewTravelPackage {
  id?: number;
  name: string;
  description: string;
  price: number;
  flights?: Flight[];
  hotels?: HotelBooking[];
  activities?: Activity[];
  photos?: Photo[];
  photo_ids?: number[];
  startingDate: Date;
  endingDate: Date;
  user: number;
}

export interface Billing {
  id: number;
  paymentType: PaymentType;
  paymentState: PaymentState;
  firstName: string;
  lastName: string;
  firstLineAddress: string;
  secondLineAddress?: string;
  zipCode: string;
  city: string;
  state_area: string;
  country: string;
}

export interface Booking {
  id: number;
  bookingNo: string;
  cost: number;
  purchaseDate: Date;
  billing: Billing;
  bookingState: BookingState;
  travelPackage: TravelPackage;
  firstName: string;
  lastName: string;
  firstLineAddress: string;
  secondLineAddress?: string;
  zipCode: string;
  city: string;
  state_area: string;
  country: string;
  email: string;
  phone?: string;
  nbr_adult: number;
  nbr_child: number;
}

export interface NbrPerson {
    id: number;
    nbr_adult: number;
    nbr_child: number;
}

export interface MergedItem {
  sortDate: Date;
  type: 'Flight' | 'Hotel' | 'Activity';
  [key: string]: any; // Allows the object to have any number of other properties
}

export type JourneyItem =
  | (Flight & { type: 'flight' })
  | (HotelBooking & { type: 'hotel' })
  | (Activity & { type: 'activity' });
