import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TravelPackageService } from '../services/travel-package.service';
import { TravelPackage, MergedItem } from '../interfaces/booking.interface';
import {RouterModule} from '@angular/router';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { from, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatDatepickerModule, MatNativeDateModule, FormsModule],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css'
})

export class TravelPackageDetailsComponent implements OnInit {
  private _travelPackage?: TravelPackage;
  private temp_travelPackage?: TravelPackage;
  sortedItems: MergedItem[] = [];
  nbr_adult: number = 2;
  nbr_child: number = 0;
  temp!: any
  removeFromCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private travelPackageService: TravelPackageService,
    private location: Location,
  ) {}

  async ngOnInit() {
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

    // Asynchronous function, need to await the result using async/await
    this._travelPackage = await this.travelPackageService.getTravelPackageByIdSynchronous(packageIdString);

    if (!this._travelPackage) {
      console.error('Travel package not found');
    }
    this.sortedItems = this.mergeAndSortItems();

    packageId && this.travelPackageService.onePackageById(packageId).subscribe((result: TravelPackage) => {
        this.temp_travelPackage = result;
        let cartData = localStorage.getItem('localCart');
        if(this.temp_travelPackage && cartData){
          let cartItems = JSON.parse(cartData);
          cartItems = cartItems.filter((item: any) => packageId === item.id);
          this.removeFromCart = cartItems.length > 0;
        }

      },
    );

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

  addToCart(): void {
    if(this._travelPackage){
      if(!localStorage.getItem('user')){
        this.travelPackageService.localAddToCart(this._travelPackage);
        this.removeFromCart = true;
      }
    }
  }


  removeToCart(id: number): void {
    this.travelPackageService.localRemoveToCart(id);
    this.removeFromCart = false;
  }


  mergeAndSortItems(): MergedItem[] {
    let mergedItems: MergedItem[] = [];

    if (!this._travelPackage) return [];

    const { flights, hotels, activities } = this._travelPackage;

    console.warn('flights', flights);

    flights?.forEach(flight => {
      mergedItems.push({ ...flight, sortDate: new Date(flight.departureDate), type: 'Flight'});
    });

    hotels?.forEach(hotel => {
      mergedItems.push({ ...hotel, sortDate: new Date(hotel.checkIn), type: 'Hotel' });
    });

    activities?.forEach(activity => {
      mergedItems.push({ ...activity, sortDate: new Date(activity.date), type: 'Activity' });
      console.warn('mergedItems', activity.date);
    });

    // Sort by sortDate
    mergedItems.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return mergedItems;
  }

}
