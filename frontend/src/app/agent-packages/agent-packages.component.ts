import { Component, OnInit } from '@angular/core';
import {TravelPackage, Flight, HotelBooking, Activity, Photo, NewTravelPackage} from "../interfaces/booking.interface";
import {TravelPackageService} from "../services/travel-package.service";
import {Observable} from "rxjs";
import {UploadService} from "../services/upload.service";
import {Router} from "@angular/router";

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
  imagesToUpload: File[] | null = [];
  uploadedImages: any[] = [];
  newPhotosSelected?: boolean;
  photosAdded?: boolean;
  photoAddedIDs: number[] = [];

  constructor(private travelingPackageService: TravelPackageService, private uploadService: UploadService, private router: Router) { }

  ngOnInit(): void {
    this.travelingPackageService.getAllTravelPackages().subscribe((data: TravelPackage[]) => {
    this.travelPackages = data;
    });
    console.log("Fetched travelPackages in agent-packages")
    console.log(this.travelPackages);
    this.newPackageCheck = false;
  }

  reloadCurrentRoute() {
    // A trick to reload the current route
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
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
      photos: [],
      startingDate: new Date(),
      endingDate: new Date()
    };
  }

  savePackage(): void {
    if (this.newPackage) {
      const newPackage: NewTravelPackage = this.newPackage!;
      this.travelingPackageService.addTravelPackage(newPackage).subscribe({
        next: (response) => {console.log('Package saved successfully!', response); this.reloadCurrentRoute()},
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
      this.travelingPackageService.editTravelPackage(this.editingPackage.id, this.editingPackage).subscribe({
        next: (response) => {console.log('Package saved successfully!', response); this.reloadCurrentRoute()},
        error: (error) => console.error('Error saving package:', error)});
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
    this.photoAddedIDs = [];
    this.photosAdded = false;
    this.imagesToUpload = [];
    this.newPhotosSelected = false;
    this.selectedFiles = [];
    this.uploadedImages = [];
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

  /*
    handleFileInput(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]); //TODO: error here, why??????????
      }
    }
  }
*/

  handleFileInput(event: any): void {
    const fileList: FileList = event.target.files;
    const uploadDir = 'photos/travel-packages';

    if (!this.imagesToUpload) {
      this.imagesToUpload = [];
    }

    for (let i = 0; i < fileList.length; i++) {
      this.imagesToUpload.push(fileList[i]);
    }
    this.newPhotosSelected = true;
    console.log(this.imagesToUpload);
    console.log(this.newPackage!); //TODO: delete this debug line
  }

  removePhotos(): void {
    this.newPackage!.photos = []; //TODO: add the delete request
    this.newPackage!.photo_ids = [];
    this.uploadedImages = [];
    this.imagesToUpload = [];
    this.photoAddedIDs = [];
    console.log(this.imagesToUpload);
    console.log(this.newPackage);
    console.log(this.photoAddedIDs);
    const fileInput = document.getElementById('packagePhoto') as HTMLInputElement;
    fileInput.value = '';
    this.newPhotosSelected = false;
    this.photosAdded = false;
  }

  addPhoto(uploadDir: string): void {
  if (this.imagesToUpload) {
    const uploadPromises = this.imagesToUpload.map(imageToUpload => {
      return new Promise((resolve, reject) => {
        this.uploadService.uploadFile(imageToUpload, uploadDir).subscribe(
          response => {
            if (response.type === 4) { // HttpResponse
              console.log(response);
              const responseBody = response.body;
              this.uploadedImages.push({
                name: imageToUpload.name,
                url: responseBody.url,
                caption: responseBody.caption,
                uploadDir: responseBody.upload_dir
              });
              //this.newPackage?.photos?.push({
              //  url: responseBody.url,
              //  caption: responseBody.caption
              //});
              if (responseBody.id) {
                if(!this.newPackage?.photo_ids) {
                  this.newPackage!.photo_ids = [responseBody.id];
                }
                else {
                  this.newPackage!.photo_ids!.push(responseBody.id);
                }
                this.photoAddedIDs.push(responseBody.id);
              }
              resolve(responseBody);
            }
          },
          error => {
            console.error("Error during the image upload: ", error);
            reject(error);
          }
        );
      });
    });

    Promise.all(uploadPromises).then(() => {
      this.newPhotosSelected = false;
      this.photosAdded = true;
      console.log("Uploaded photos IDs:", this.photoAddedIDs);
    }).catch(error => {
      console.error("Error in uploading one or more photos", error);
    });
  }
}

  /*
  addPhoto(uploadDir: string): void {
    if(this.imagesToUpload) {
      while(this.imagesToUpload.length > 0) {
        let imageToUpload = this.imagesToUpload.pop();
        if (imageToUpload !== undefined) {
          this.uploadService.uploadFile(imageToUpload, uploadDir).subscribe(
            response => {
              if (response.type === 4) { // HttpResponse
                console.log(response);
                const responseBody = response.body;
                this.uploadedImages.push({
                  name: imageToUpload!.name,
                  url: responseBody.url,
                  caption: responseBody.caption,
                  uploadDir: responseBody.upload_dir
                });
                this.newPackage?.photos?.push({
                  url: responseBody.url,
                  caption: responseBody.caption
                });
                this.imagesToUpload!.pop();
              }
            },
            error => console.error("Error during the image upload: ", error)
          );
        }
      }
    }
    this.newPhotosSelected = false;
    this.photosAdded = true;
    console.log(this.imagesToUpload);
  }
   */

deleteAllUploadedImages(): void {
  this.uploadedImages.forEach(image => {
    this.uploadService.deleteImage(image.url).subscribe({
      next: (response) => {
        console.log('Photo deleted successfully.', response);
      },
      error: (error) => {
        console.error("Error occurred during photo removal: ", error);
      }
    });
  });
  this.uploadedImages = [];
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
