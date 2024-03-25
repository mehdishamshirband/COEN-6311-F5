import { Component, OnInit } from '@angular/core';
import { TravelPackage, Flight, HotelBooking, Activity, Photo } from "../interfaces/booking.interface";
import {TravelPackageService} from "../services/travel-package.service";

@Component({
  selector: 'app-agent-packages',
  templateUrl: './agent-packages.component.html',
})
export class AgentPackagesComponent implements OnInit {
  travelPackages: TravelPackage[] = [];
  editingPackage?: TravelPackage;
  selectedPackageId?: number;

  constructor(private travelingPackageService: TravelPackageService) { }

  ngOnInit(): void {
    this.travelPackages = this.travelingPackageService.getAllTravelPackages();
  }

  initNewPackage(): void {
    this.editingPackage = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      flights: [],
      hotels: [],
      activities: [],
      startingDate: new Date(),
      endingDate: new Date(),
      photos: []
    };
  }

  savePackage(): void {
    if (!this.editingPackage) return;
    const index = this.travelPackages.findIndex(p => p.id === this.editingPackage!.id);
    if (index > -1) {
      this.travelPackages[index] = this.editingPackage;
    } else {
      this.travelPackages.push(this.editingPackage);
    }
    this.editingPackage = undefined;
  }

  startEditingPackage(packageId: number): void {
    const travelPackage = this.travelPackages.find(p => p.id === packageId);
    if (travelPackage) {
      travelPackage.flights = travelPackage.flights || [];
      travelPackage.hotels = travelPackage.hotels || [];
      this.editingPackage = JSON.parse(JSON.stringify(travelPackage)); // Deep clone
    }
  }

  confirmPackageDeletion(index: number, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this travel package?')) {
      this.deletePackage(index);
    }
  }
  deletePackage(index: number): void {
    this.travelPackages.splice(index, 1);
  }

  cancelEditingPackage(): void {
    this.editingPackage = undefined;
  }

    handleFileInput(event: any): void {
    if (!this.editingPackage) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const photo: Photo = { url: e.target.result, caption: '' };
        this.editingPackage!.photos = [photo];
      };
      reader.readAsDataURL(file);
    }
  }

  get sortedJourneyItems(): any[] {
    if (!this.selectedPackageId) return [];

    const selectedPackage = this.travelPackages.find(p => p.id === this.selectedPackageId);
    if (!selectedPackage) return [];

    const flights = selectedPackage.flights?.map(item => ({ ...item, itemType: 'flight', sortDate: item.departureDate })) || [];
    const hotels = selectedPackage.hotels?.map(item => ({ ...item, itemType: 'hotel', sortDate: item.checkIn })) || [];
    const activities = selectedPackage.activities?.map(item => ({ ...item, itemType: 'activity', sortDate: item.date })) || [];

    const allItems = [...flights, ...hotels, ...activities];
    allItems.sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime());

    return allItems;
  }

  selectPackage(id: number): void {
    this.selectedPackageId = id;
  }

  clearSelection(): void {
    this.selectedPackageId = undefined;
  }

    MinToHoursMin(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins}`;
  }
}
