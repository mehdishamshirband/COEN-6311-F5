import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentPackagesComponent } from './agent-packages/agent-packages.component';
import { UserBookingInformationComponent } from './user-booking-information/user-booking-information.component';
import { UserBookingsListComponent } from './user-bookings-list/user-bookings-list.component';
import { TravelPackageGalleryComponent } from "./travel-package-gallery/travel-package-gallery.component";
import { TravelPackageDetailsComponent } from "./package-details/package-details.component"

const routes: Routes = [
  { path: 'agent-packages', component: AgentPackagesComponent },
  { path: 'booking-details/:bookingNo', component: UserBookingInformationComponent },
  { path: 'bookings', component: UserBookingsListComponent},
  { path: 'search', component: TravelPackageGalleryComponent},
  { path: 'package-details/:id', component: TravelPackageDetailsComponent },

  { path: '', redirectTo: '/search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

