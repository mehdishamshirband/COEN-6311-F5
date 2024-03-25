import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
// Import other components here
import { AgentPackagesComponent } from './agent-packages/agent-packages.component';
import { UserBookingInformationComponent } from './user-booking-information/user-booking-information.component';
import { UserBookingsListComponent } from './user-bookings-list/user-bookings-list.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BookingService } from './services/booking.service';
import { NavBarComponent} from "./navbar/navbar.component";
import { TravelPackageItemComponent } from "./travel-package-item/travel-package-item.component";
import { TravelPackageGalleryComponent } from "./travel-package-gallery/travel-package-gallery.component";
import { TravelPackageService } from "./services/travel-package.service";
import { ScrollToTopService } from "./services/scroll-to-top.service";
import { TravelPackageDetailsComponent } from "./package-details/package-details.component";
import { FlightGalleryComponent } from "./flight-gallery/flight-gallery.component";
import { HotelGalleryComponent } from "./hotel-gallery/hotel-gallery.component";
import { ActivityGalleryComponent } from "./activity-gallery/activity-gallery.component";
import { CustomPackageCreationComponent } from "./custom-package-creation/custom-package-creation.component";
import { MinToHoursMinPipe } from "./min-to-hours-min.pipe";
import {AgentFlightManagementComponent} from "./agent-flight-management/agent-flight-management.component";
import {AgentHotelManagementComponent} from "./agent-hotel-management/agent-hotel-management.component";
import {AgentActivityManagementComponent} from "./agent-activity-management/agent-activity-management.component";
import { UserAccountInformationComponent } from "./user-account-information/user-account-information.component";


@NgModule({
  declarations: [
    AppComponent,
    AgentPackagesComponent,
    UserBookingInformationComponent,
    UserBookingsListComponent,
    AgentFlightManagementComponent,
    AgentHotelManagementComponent,
    AgentActivityManagementComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    NavBarComponent,
    TravelPackageItemComponent,
    TravelPackageGalleryComponent,
    TravelPackageDetailsComponent,
    FlightGalleryComponent,
    HotelGalleryComponent,
    ActivityGalleryComponent,
    CustomPackageCreationComponent,
    MinToHoursMinPipe,
    UserAccountInformationComponent
  ],
  providers: [BookingService, TravelPackageService, ScrollToTopService],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
