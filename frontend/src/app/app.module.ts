import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    AgentPackagesComponent,
    UserBookingInformationComponent,
    UserBookingsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    NavBarComponent,
    TravelPackageItemComponent,
    TravelPackageGalleryComponent,
    TravelPackageDetailsComponent,

  ],
  providers: [BookingService, TravelPackageService, ScrollToTopService],
  bootstrap: [AppComponent]
})
export class AppModule { }
