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

  constructor(private travelingPackageService: TravelPackageService) {}

  ngOnInit() {
    this.travelPackageList = this.travelingPackageService.getAllTravelPackages();
    this.filteredTravelPackageList = this.travelPackageList;

    const placeholders = ["I want to go to...", "I want to do..."];
    let index = 0;
    setInterval(() => {
      this.fade = true; // Begin fade-out
      setTimeout(() => {
        index = (index + 1) % placeholders.length; // Cycle through placeholders
        this.placeholderSearchbarText = placeholders[index];
        this.fade = false; // Begin fade-in
      }, 1000); // Halfway through the interval, change the text
    }, 6000); // Change every 3 seconds
  }

  filterResults(filterValue: string) {
    if (!filterValue) {
      this.filteredTravelPackageList = this.travelPackageList;
      return;
    }
    this.filteredTravelPackageList = this.travelPackageList.filter(packageData =>
      packageData.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      packageData.description.toLowerCase().includes(filterValue.toLowerCase())
      // Expand
    );

    console.log(this.filteredTravelPackageList);
  }
}
