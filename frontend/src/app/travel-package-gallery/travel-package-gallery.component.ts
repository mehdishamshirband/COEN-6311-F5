import { Component, OnInit } from '@angular/core';
import { TravelPackage } from '../interfaces/booking.interface';
import { TravelPackageItemComponent } from '../travel-package-item/travel-package-item.component';
import { TravelPackageService } from '../services/travel-package.service';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-travel-package-gallery',
  standalone: true,
  imports: [TravelPackageItemComponent, NgForOf],
  templateUrl: './travel-package-gallery.component.html',
  styleUrls: ['./travel-package-gallery.component.css']
})
export class TravelPackageGalleryComponent implements OnInit {
  travelPackageList: TravelPackage[] = [];
  filteredTravelPackageList: TravelPackage[] = [];

   placeholderSearchbarText: string = "I want to go to...";
   fade: boolean = false; // Control the fade effect
   not_filtered: boolean = true; // Control the text effect

  constructor(private travelingPackageService: TravelPackageService) {}

  ngOnInit() {
    this.travelingPackageService.getAllTravelPackages().subscribe({next: (travelPackages) => {
        this.travelPackageList = travelPackages;
        this.filteredTravelPackageList = this.travelPackageList;
        console.warn('Travel Packages:', travelPackages);
      },
      error: (error) => {
        console.error('Error fetching travel packages:', error);
      }
    });


    const placeholders = ["I want to go to...", "I want to do..."];
    let index = 0;
    setInterval(() => {
      this.fade = true; // Begin fade-out
      setTimeout(() => {
        index = (index + 1) % placeholders.length; // Cycle through placeholders
        if (this.not_filtered){
          this.placeholderSearchbarText = placeholders[index];
        }
        else{
          this.placeholderSearchbarText = "";
        }
        this.fade = false; // Begin fade-in
      }, 1000); // Halfway through the interval, change the text
    }, 6000); // Change every 3 seconds
  }

  filterResults(filterValue: string) {
    if (!filterValue) {
      this.filteredTravelPackageList = this.travelPackageList;
      this.not_filtered = true;
      return;
    }

    this.not_filtered = false;
    this.travelingPackageService.filterTravelPackages(filterValue).subscribe({next: (travelPackages) => {
        this.filteredTravelPackageList = travelPackages;
        console.warn('Filtered Travel Packages:', travelPackages);
      },
      error: (error) => {
        console.error('Error fetching travel packages:', error);
      }
    });





    /*
    this.filteredTravelPackageList = this.travelPackageList.filter(packageData =>
      packageData.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
      packageData.description?.toLowerCase().includes(filterValue.toLowerCase()) ||
      packageData.activities?.some(activity =>
        activity.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        activity.type?.toLowerCase().includes(filterValue.toLowerCase()) ||
        activity.description?.toLowerCase().includes(filterValue.toLowerCase()) ||
        activity.location?.toLowerCase().includes(filterValue.toLowerCase())
      ) ||
      packageData.hotels?.some(hotel =>
        hotel.hotel.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        hotel.hotel.location?.toLowerCase().includes(filterValue.toLowerCase())
      ) ||
      packageData.flights?.some(flight =>
        flight.departureCity?.toLowerCase().includes(filterValue.toLowerCase()) || //TODO: include country and airport too
        flight.arrivalCity?.toLowerCase().includes(filterValue.toLowerCase()) ||
        flight.airline?.toLowerCase().includes(filterValue.toLowerCase())
      )
    );
    */
  }


}
