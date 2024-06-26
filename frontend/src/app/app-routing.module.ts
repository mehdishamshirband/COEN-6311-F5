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
import { CartComponent } from "./cart/cart.component";
import { AgentActivityManagementComponent } from "./agent-activity-management/agent-activity-management.component";
import { AgentFlightManagementComponent } from "./agent-flight-management/agent-flight-management.component";
import { AgentHotelManagementComponent } from "./agent-hotel-management/agent-hotel-management.component";
import { UserAccountInformationComponent } from "./user-account-information/user-account-information.component";
import { CancelledBookingComponent } from "./cancelled-booking/cancelled-booking.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { PaymentComponent } from "./payment/payment.component";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { AgentReportComponent } from "./agent-report/agent-report.component";
import { NotificationComponent } from "./notification/notification.component";

const routes: Routes = [
  { path: 'agent-packages', component: AgentPackagesComponent },
  { path: 'agent-report', component: AgentReportComponent },
  { path: 'booking-details/:bookingNo', component: UserBookingInformationComponent },
  { path: 'cancelled-booking/:bookingNo', component: CancelledBookingComponent },
  { path: 'bookings', component: UserBookingsListComponent},
  { path: 'search', component: TravelPackageGalleryComponent},
  { path: 'package-details/:id', component: TravelPackageDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'custom-package/flights', component: FlightGalleryComponent },
  { path: 'custom-package/hotels', component: HotelGalleryComponent },
  { path: 'custom-package/activities', component: ActivityGalleryComponent },
  { path: 'custom-package', component: CustomPackageCreationComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'signup', component: UserSignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'agent-packages/activities', component: AgentActivityManagementComponent }, //TODO: delete
  { path: 'agent-packages/flights', component: AgentFlightManagementComponent }, //TODO: delete
  { path: 'agent-packages/hotels', component: AgentHotelManagementComponent }, //TODO: delete
  { path: 'account', component: UserAccountInformationComponent},
  { path: 'notification/:id', component: NotificationComponent},

  { path: '', redirectTo: '/search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

