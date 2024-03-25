import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Activity, Photo } from "../interfaces/booking.interface";

@Component({
  selector: 'app-agent-activity-management',
  templateUrl: './agent-activity-management.component.html',
  styleUrl: './agent-activity-management.component.css'
})
export class AgentActivityManagementComponent {
  @Input() activities: Activity[] = [];
  @Output() activitiesChange = new EventEmitter<Activity[]>();
  editingActivity?: Activity;
  newActivity?: boolean;

  constructor() { }

  initNewActivity(): void {
    this.newActivity = true;
    this.editingActivity = {
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
    this.newActivity = false;
    event.preventDefault();
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      this.editingActivity = JSON.parse(JSON.stringify(activity)); // Ensures a deep clone
    }
  }

  saveActivity(): void {
    if (!this.editingActivity) return;
    const index = this.activities.findIndex(a => a.id === this.editingActivity!.id);
    if (index > -1) {
      this.activities[index] = this.editingActivity;
    } else {
      this.activities.push(this.editingActivity);
    }
    this.activitiesChange.emit(this.activities);
    this.editingActivity = undefined;
  }

  cancelEditingActivity(): void {
    this.editingActivity = undefined;
  }

  addPhotoField(): void {
    if (this.editingActivity && this.editingActivity!.photos!.length < 5) {
      this.editingActivity!.photos!.push({ url: '', caption: '' });
    }
  }

  removePhoto(index: number): void {
    if (this.editingActivity && this.editingActivity.photos) {
      this.editingActivity.photos.splice(index, 1);
    }
  }

  handleFileInput(event: any, index: number): void {
    if (!this.editingActivity || !this.editingActivity.photos) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editingActivity!.photos![index].url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteActivity(index: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.activities.splice(index, 1);
    this.activitiesChange.emit(this.activities);
  }
}


