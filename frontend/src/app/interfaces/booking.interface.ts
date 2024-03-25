export interface Photo {
  url: string;
  caption?: string;
}

export enum PaymentType {
  Visa = 'Visa',
  Paypal = 'Paypal',
}

export enum PaymentState {
  FirstDeposit,
  SecondDeposit,
  LastDeposit,
}

export enum BookingState {
  Processing = 'In process',
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
  Failed = 'Failed',
  Refunded = 'Refunded',
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
  showDetails?: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  photo?: Photo;
  website?: string;
}

export interface HotelBooking {
  id: number;
  hotel: Hotel;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  showDetails?: boolean;
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
  showDetails?: boolean;
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
  showDetails?: boolean;
}

export interface Billing {
  id: number;
  paymentType: PaymentType;
  paymentState: PaymentState;
  firstName: string;
  lastName: string;
  firstLineAddress: string;
  secondLineAddress: string;
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
  secondLineAddress: string;
  zipCode: string;
  city: string;
  state_area: string;
  country: string;
  email: string;
  phone: string;
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
