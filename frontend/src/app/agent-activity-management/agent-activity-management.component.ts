import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Activity, NewActivity, NewTravelPackage, Photo} from "../interfaces/booking.interface";
import {UploadService} from "../services/upload.service";

@Component({
  selector: 'app-agent-activity-management',
  templateUrl: './agent-activity-management.component.html',
  styleUrl: './agent-activity-management.component.css'
})
export class AgentActivityManagementComponent implements OnInit {
  @Input() activities: NewActivity[] = [];
  @Output() activitiesChange = new EventEmitter<NewActivity[]>();
  editingActivity?: NewActivity;
  newActivity?: NewActivity;
  newActivityCheck?: boolean;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.newActivityCheck = false;
  }

  get currentActivity(): any {
    return this.newActivityCheck ? this.newActivity : this.editingActivity;
  }

  initNewActivity(): void {
    this.newActivityCheck = true;
    console.log(this.newActivityCheck); //TODO: remove this debug line
    this.newActivity = {
      id: Date.now(),
      name: '',
      type: '',
      description: '',
      location: '',
      date: new Date(),
      price: 0,
      photos: []
    };
  }

  startEditingActivity(activityId: number, event: MouseEvent): void {
    this.newActivityCheck = false;
    event.preventDefault();
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      this.editingActivity = JSON.parse(JSON.stringify(activity));
      console.log(this.editingActivity);
    }
  }

  saveActivity(): void {
    if (this.newActivityCheck && this.newActivity) {
      this.activities.push(this.newActivity);
    }
    else if (this.editingActivity) {
      const index = this.activities.findIndex(a => a.id === this.editingActivity!.id);
      if (index > -1) {
        this.activities[index] = this.editingActivity;
      } else {
        this.activities.push(this.editingActivity);
      }
    }
    this.activitiesChange.emit(this.activities);
    this.editingActivity = undefined;
    this.newActivityCheck = false;
    this.newActivity = undefined;
    console.log(this.activities);
  }

  cancelEditingActivity(): void {
    this.editingActivity = undefined;
    this.newActivityCheck = false;
    this.newActivity = undefined;
  }

  addPhotoField(): void {
    if(this.newActivityCheck) {
      if(this.newActivity && this.newActivity!.photos!.length < 5) {
        this.newActivity!.photos!.push({url: '', caption: ''});
      }
    }
    if (this.editingActivity && this.editingActivity!.photos!.length < 5) {
      this.editingActivity!.photos!.push({ url: '', caption: '' });
    }
  }

  removePhoto(index: number): void {
    if (this.newActivityCheck && this.newActivity) {
      this.newActivity.photos?.splice(index, 1);
      this.newActivity.photo_ids?.splice(index, 1);
    }
    console.log(this.newActivity); //TODO: delete these debug lines
    if (this.editingActivity && this.editingActivity.photos) {
      this.editingActivity.photos.splice(index, 1);
      this.editingActivity.photo_ids?.splice(index, 1);
    }
  }

  handleFileInput(event: any, index: number): void {
    const file = event.target.files[0];
    const uploadDir = 'photos/activities';
    if (file) {
      if (this.newActivityCheck && this.newActivity) {
        this.uploadService.uploadFile(file, uploadDir).subscribe(
          response => {
            if (response.type === 4) { // HttpResponse
              console.log(response);
              const responseBody = response.body;
              if (responseBody.id) {
                if (this.newActivity?.photo_ids) {
                  this.newActivity!.photo_ids[index] = responseBody.id;
                }
                else {
                  this.newActivity!.photo_ids= [responseBody.id];
                }
                if (this.newActivity?.photos) {
                  this.newActivity!.photos[index] = {url: responseBody.url, caption: responseBody.caption};
                }
              }
              console.log(this.newActivity); //TODO: delete these debug lines
            }
          },
          error => {
            console.error("Error during the image upload: ", error);
          }
        );
      }
      else if (this.editingActivity) {
        this.uploadService.uploadFile(file, uploadDir).subscribe(
          response => {
            if (response.type === 4) { // HttpResponse
              console.log(response);
              const responseBody = response.body;
              if (responseBody.id) {
                if (this.editingActivity?.photo_ids) {
                  this.editingActivity!.photo_ids[index] = responseBody.id;
                }
                else {
                  this.editingActivity!.photo_ids= [responseBody.id];
                }
                if (this.editingActivity?.photos) {
                  this.editingActivity!.photos[index] = {url: responseBody.url, caption: responseBody.caption};
                }
              }
              console.log(this.editingActivity); //TODO: delete these debug lines
            }
          },
          error => {
            console.error("Error during the image upload: ", error);
          }
        );
      }
    }
  }

  deleteActivity(index: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.activities.splice(index, 1);
    this.activitiesChange.emit(this.activities);
    this.editingActivity = undefined;
    this.newActivity = undefined;
  }
}


