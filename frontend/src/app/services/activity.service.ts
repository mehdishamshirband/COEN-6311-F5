// activity.service.ts
import { Injectable } from '@angular/core';
import { Activity } from '../interfaces/booking.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities: Activity[] = [
    // Example activities
    {
      id: 201,
      name: 'City Tour',
      type: 'Sightseeing',
      description: 'Explore the city\'s landmarks.',
      location: 'New York',
      date: new Date(2024, 8, 5),
      price: 190,
      photos: [{url: 'assets/images/activities/new-york-city-tour.jpg'}],
      showDetails: false
    },
    {
      id: 202,
      name: 'Mountain Hiking',
      type: 'Adventure',
      description: 'A challenging mountain hike.',
      location: 'Rocky Mountains',
      date: new Date(2024, 8, 7),
      price: 90,
      photos: [{url: 'assets/images/activities/moutain-hiking-rocky-mountains.jpg'}],
      showDetails: false
    }
  ];

  constructor() { }

  getAllActivities(): Observable<Activity[]> {
    return of(this.activities);
  }

searchActivities(location: string, date: Date | string | null): Observable<Activity[]> {
  const normalizedLocation = location.toLowerCase().trim();

  let searchDate: Date | null = null;
  if (date) {
    searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
  }

  // TODO: Add other filters such as title and type
  const results = this.activities.filter(activity => {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);

    const locationMatch = normalizedLocation.length === 0 || activity.location.toLowerCase().includes(normalizedLocation);
    const dateMatch = !searchDate || activityDate.getTime() === searchDate.getTime()+86400000;
    console.log("Search Date:", searchDate!.getTime() + 86400000);
    console.log("Activity Date:", activityDate?.getTime());
    return locationMatch || dateMatch;
  });

  return of(results);
}


}
