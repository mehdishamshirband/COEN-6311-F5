// activity-gallery.component.ts
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Activity, Flight} from '../interfaces/booking.interface';
import { ActivityService } from "../services/activity.service";
import {JourneyService} from "../services/journey.service";

@Component({
  selector: 'app-activity-gallery',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule // Include CommonModule here
  ],
  templateUrl: './activity-gallery.component.html',
  styleUrls: ['./activity-gallery.component.css']
})

export class ActivityGalleryComponent implements OnInit {
  searchForm: FormGroup;
  activityList: Activity[] = [];
  searchPerformed = false;

  @Output() activityAdded = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private activityService: ActivityService, private journeyService: JourneyService) {
    this.searchForm = this.fb.group({
      location: [''],
      date: ['']
    });
  }

  ngOnInit() {
    void this.activityService.getAllActivities().subscribe({
      next: (activities : Activity[]) => {
        this.activityList = activities;
        console.warn('Activities:', activities);
        //TODO check the image, because we handle them as a list
      },
      error: (error) => {
        console.error('Error fetching activities:', error);
      }
    });
  }

searchActivities() {
    /*

  const formValue = this.searchForm.value;

  // Convert form date string to Date object if not null
  let searchDate: Date | null = null;
  if (formValue.date) {
    searchDate = new Date(formValue.date);
  }
  */
  this.searchPerformed = true;
  void this.activityService.searchActivities(this.searchForm.value.location, this.searchForm.value.date).subscribe({
    next: (results) => {
      this.activityList = results;
      console.warn('Results:', results);
    },
    error: (error) => {
      console.error('Error fetching activities:', error);
    }
  });
}

  resetSearch() {
    this.searchForm.reset();
    this.ngOnInit();
    //this.activityList = [];
    this.searchPerformed = false;
  }

  addToJourney(activity: Activity) {
    this.journeyService.addActivity(activity);
      this.activityAdded.emit(true);
  }

}
