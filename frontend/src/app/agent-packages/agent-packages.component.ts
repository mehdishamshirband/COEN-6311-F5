import { Component, OnInit } from '@angular/core';
import {TravelPackage, Flight, HotelBooking, Activity, Photo, NewTravelPackage} from "../interfaces/booking.interface";
import {TravelPackageService} from "../services/travel-package.service";
import {Observable} from "rxjs";
import {UploadService} from "../services/upload.service";

@Component({
  selector: 'app-agent-packages',
  templateUrl: './agent-packages.component.html',
  styleUrl: './agent-packages.component.css'
})
export class AgentPackagesComponent implements OnInit {
  travelPackages: TravelPackage[] = [];
  editingPackage?: TravelPackage;
  newPackage?: NewTravelPackage;
  selectedPackageId?: number;
  newPackageCheck?: boolean;
  private selectedFiles: any;

  constructor(private travelingPackageService: TravelPackageService, private uploadService: UploadService) { }

  ngOnInit(): void {
    this.travelingPackageService.getAllTravelPackages().subscribe((data: TravelPackage[]) => {
    this.travelPackages = data;
    });
    console.log("Fetched travelPackages in agent-packages")
    console.log(this.travelPackages);
    this.newPackageCheck = false;
  }

  get currentPackage(): any {
    return this.newPackageCheck ? this.newPackage : this.editingPackage;
  }

  initNewPackage(): void {
    this.newPackageCheck = true;
    this.newPackage = {
      name: '',
      description: '',
      price: 0,
      flights: [],
      hotels: [],
      activities: [],
      startingDate: new Date(),
      endingDate: new Date(),
      nbr_adult: 1,
      nbr_child: 0
    };
  }

  savePackage(): void {
    if (this.newPackage) {
      const newPackage: NewTravelPackage = this.newPackage!;
      this.travelingPackageService.addTravelPackage(newPackage).subscribe({
        next: (response) => console.log('Package saved successfully!', response),
        error: (error) => console.error('Error saving package:', error)});
      this.newPackageCheck = false;
      this.newPackage = undefined;
      this.selectedPackageId = undefined;
    }
    else if (this.editingPackage) {
      const index = this.travelPackages.findIndex(p => p.id === this.editingPackage!.id);
      if (index > -1) {
        this.travelPackages[index] = this.editingPackage;
      } else {
        this.travelPackages.push(this.editingPackage);
      }
      this.editingPackage = undefined;
      this.selectedPackageId = undefined;
    }
    else return;
  }


  startEditingPackage(packageId: number): void {
    this.newPackageCheck = false;
    const travelPackage = this.travelPackages.find(p => p.id === packageId);
    if (travelPackage) {
      travelPackage.flights = travelPackage.flights || [];
      travelPackage.hotels = travelPackage.hotels || [];
      this.editingPackage = JSON.parse(JSON.stringify(travelPackage)); // Deep clone
    }
    console.log("editingPackage: ", this.editingPackage); //TODO: remove or comment (debug)
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
    this.newPackage = undefined;
    this.selectedPackageId = undefined;
    this.newPackageCheck = false;
  }


  /**
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
  **/

  /**
  handleFileInput(event: any, uploadDir: string): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadService.uploadFile(files[i], uploadDir).subscribe(
          event => {
            console.log('File upload event:', event);
            // Handle the upload event, e.g., progress, completion, etc.
          },
          error => console.error('File upload error:', error)
        );
      }
    }
  }
**/

    handleFileInput(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]); //TODO: error here, why??????????
      }
    }
  }

addPhoto(uploadDir: string): void {
  this.selectedFiles.forEach((file: File) => {
    this.uploadService.uploadFile(file, uploadDir).subscribe(
      event => {
        console.log('File upload event:', event);
        // Handle the upload event, e.g., progress, completion, etc.
      },
      error => console.error('File upload error:', error)
    );
  });
}

  removePhoto(): void { //TODO: implement the remove in the backend part
    this.selectedFiles = [];
    const fileInput = document.getElementById('packagePhoto') as HTMLInputElement;
    fileInput.value = '';
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

  protected readonly Date = Date;
}
