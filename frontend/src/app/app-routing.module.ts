import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentPackagesComponent } from './agent-packages/agent-packages.component';
import { UserBookingInformationComponent } from './user-booking-information/user-booking-information.component';
import { UserBookingsListComponent } from './user-bookings-list/user-bookings-list.component';
import { TravelPackageGalleryComponent } from "./travel-package-gallery/travel-package-gallery.component";
import { TravelPackageDetailsComponent } from "./package-details/package-details.component"
import { FlightGalleryComponent } from "./flight-gallery/flight-gallery.component";
import {HotelGalleryComponent} from "./hotel-gallery/hotel-gallery.component";
import {ActivityGalleryComponent} from "./activity-gallery/activity-gallery.component";
import {CustomPackageCreationComponent} from "./custom-package-creation/custom-package-creation.component";
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignUpComponent } from "./user-sign-up/user-sign-up.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
  { path: 'agent-packages', component: AgentPackagesComponent },
  { path: 'booking-details/:bookingNo', component: UserBookingInformationComponent },
  { path: 'bookings', component: UserBookingsListComponent},
  { path: 'search', component: TravelPackageGalleryComponent},
  { path: 'package-details/:id', component: TravelPackageDetailsComponent },
  { path: 'custom-package/flights', component: FlightGalleryComponent },
  { path: 'custom-package/hotels', component: HotelGalleryComponent },
  { path: 'custom-package/activities', component: ActivityGalleryComponent },
  { path: 'custom-package', component: CustomPackageCreationComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'signup', component: UserSignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

