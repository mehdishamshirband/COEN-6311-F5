import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TravelPackageService } from '../services/travel-package.service';
import { TravelPackage, MergedItem } from '../interfaces/booking.interface';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css'
})
export class TravelPackageDetailsComponent implements OnInit {
  private _travelPackage?: TravelPackage;
  sortedItems: MergedItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private travelPackageService: TravelPackageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const packageIdString = +this.route.snapshot.paramMap.get('id')!;

    if (packageIdString === null) {
    console.error('Package ID is missing');
    return;
  }

    const packageId = +packageIdString
    if (!packageId) {
      console.error('Package ID is missing');
      return;
    }
    this._travelPackage = this.travelPackageService.getTravelPackageById(packageId);
    if (!this._travelPackage) {
      console.error('Travel package not found');
    }
    this.sortedItems = this.mergeAndSortItems();
  }


  get travelPackage(): TravelPackage | undefined {
    return this._travelPackage;
  }

  get photoUrl(): string {
    return this._travelPackage?.photos?.[0]?.url || 'defaultImageUrl';
  }

  get photoCaption(): string {
    return this._travelPackage?.photos?.[0]?.caption || 'defaultCaption';
  }

  goBack(): void {
    this.location.back();
  }

    mergeAndSortItems(): MergedItem[] {
    let mergedItems: MergedItem[] = [];

    if (!this._travelPackage) return [];

    const { flights, hotels, activities } = this._travelPackage;

    flights?.forEach(flight => {
      mergedItems.push({ ...flight, sortDate: flight.departureDate, type: 'Flight'});
    });

    hotels?.forEach(hotel => {
      mergedItems.push({ ...hotel, sortDate: hotel.checkIn, type: 'Hotel' });
    });

    activities.forEach(activity => {
      mergedItems.push({ ...activity, sortDate: activity.date, type: 'Activity' });
    });

    // Sort by sortDate
    mergedItems.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return mergedItems;
  }

}
