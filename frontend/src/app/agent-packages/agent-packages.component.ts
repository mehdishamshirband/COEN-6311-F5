import { Component, OnInit } from '@angular/core';

interface Flight {
  id: number;
  departure: string;
  arrival: string;
  departureDate: Date;
  arrivalDate: Date;
  airline: string;
  price: number;
  showDetails?: boolean;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  pricePerNight: number;
  totalPrice: number;
  showDetails?: boolean;
}

interface Activity {
  id: number;
  name: string;
  type: string; // e.g. "Guided Tour", "Food Experience"
  description: string;
  location: string;
  date: Date;
  price: number;
  showDetails?: boolean;
}
interface TravelPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  flights?: Flight[]; // Optional
  hotels?: Hotel[]; // Optional
  activities: Activity[]; // A package can have multiple activities
  showDetails?: boolean;
}

@Component({
  selector: 'app-agent-packages',
  templateUrl: './agent-packages.component.html',
  styleUrls: ['./agent-packages.component.css']
})

export class AgentPackagesComponent implements OnInit {
  packages: TravelPackage[] = [{
    id: 1,
    name: 'Adventure in Italy',
    description: 'Experience the beauty and history of Italy with this comprehensive package.',
    price: 2500,
    flights: [
      {
        id: 101,
        departure: 'JFK',
        arrival: 'FCO',
        departureDate: new Date('2024-04-20'),
        arrivalDate: new Date('2024-04-21'),
        airline: 'United Airlines',
        price: 449
      }
    ],
    hotels: [
      {
        id: 201,
        name: 'Hotel Roma',
        location: 'Rome, Italy',
        checkIn: new Date('2024-04-21'),
        checkOut: new Date('2024-04-25'),
        pricePerNight: 80,
        totalPrice: 320
      }
    ],
    activities: [
      {
        id: 301,
        name: 'Colosseum Guided Tour',
        type: 'Guided Tour',
        description: 'This guided tour of the Colosseum...',
        location: 'Rome, Italy',
        date: new Date('2024-04-22'),
        price: 19
      },
      {
        id: 302,
        name: 'Venice Food Experience',
        type: 'Food Experience',
        description: 'other description here',
        location: 'Venice, Italy',
        date: new Date('2024-04-24'),
        price: 49
      },
  ]
}
  ];
  selectedPackage?: TravelPackage;

  // New package model for binding form inputs
  newPackage: TravelPackage = { id: 0, name: '', description: '', price: 0, activities:[] };
  showAddPackageForm = false;
  editingPackageId?: number; // Tracks the ID of the package being edited
  editedPackage: TravelPackage = { id: 0, name: '', description: '', price: 0, flights:[], hotels:[], activities:[], showDetails: false }; // For binding form inputs

  constructor() { }

  ngOnInit(): void {
  }

  selectPackage(packageToSelect: TravelPackage): void {
    this.selectedPackage = { ...packageToSelect };
  }

  toggleAddPackageForm(): void {
    this.showAddPackageForm = !this.showAddPackageForm;
    // Optionally reset newPackage if you want the form to be empty when reopened
    /***
    if (this.showAddPackageForm) {
      this.newPackage = { id: 0, name: '', description: '', price: 0 };
    }***/
  }

  addPackage(): void {
    if (this.newPackage.name && this.newPackage.description && this.newPackage.price > 0) {
      const newId = this.packages.length > 0 ? Math.max(...this.packages.map(pkg => pkg.id)) + 1 : 1;
      this.packages.push({ ...this.newPackage, id: newId });
      this.showAddPackageForm = false; // Hide the form again after adding a package
      this.newPackage = { id: 0, name: '', description: '', price: 0, flights: [], hotels: [], activities: [] }; // Reset the form
    }
  }

   cancelAddPackage(): void {
    this.showAddPackageForm = false;
    this.newPackage = { id: 0, name: '', description: '', price: 0, activities: [] };
  }

  deletePackage(packageId: number): void {
    this.packages = this.packages.filter(pkg => pkg.id !== packageId);
   this.editingPackageId = undefined;
  }

  deletePackageWithConfirmation(packageId: number, event: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const confirmation = window.confirm('Are you sure you want to delete this package?');

    if (confirmation) {
      this.deletePackage(packageId);
    }
  }

  savePackage(): void {
    if (this.selectedPackage) {
      const index = this.packages.findIndex(pkg => pkg.id === this.selectedPackage!.id);
      if (index !== -1) {
        this.packages[index] = this.selectedPackage!;
      }
      this.selectedPackage = undefined;
    }
  }

   startEditing(packageId: number, event: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const pkg = this.packages.find(p => p.id === packageId);
    if (pkg) {
        this.editingPackageId = packageId;
        this.editedPackage = {
          ...pkg,
          flights: pkg.flights || [],
          hotels: pkg.hotels || [],
          activities: pkg.activities || []
        }
      }
  }

  saveEditedPackage(event: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.editingPackageId) {
      const index = this.packages.findIndex(pkg => pkg.id === this.editingPackageId);
      if (index !== -1) {
        this.packages[index] = { ...this.editedPackage };
        this.editingPackageId = undefined; // Reset editing state
      }
    }
    // Assume backend save happens here
  }
  cancelEditingPackage(event: MouseEvent): void {
   if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.editingPackageId = undefined; // Reset editing state
  }

  addFlight(targetPackage: TravelPackage): void {
    if (!targetPackage.flights) targetPackage.flights = []; // Extra precaution
    targetPackage.flights.push({
      id: targetPackage.flights.length + 1,
      departure: '',
      arrival: '',
      airline: '',
      departureDate: new Date(),
      arrivalDate: new Date(),
      price: 0,
      showDetails: true
    });
  }

  deleteFlight(targetPackage: TravelPackage, index: number): void {
    if (targetPackage.flights) {
      targetPackage.flights.splice(index, 1);
    }
  }

  deleteFlightWithConfirmation(targetPackage: TravelPackage, flightId: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this flight booking?');
    if (confirmation) {
      this.deleteFlight(targetPackage, flightId);
    }
  }

  addHotel(targetPackage: TravelPackage): void {
  if (!targetPackage.hotels) targetPackage.hotels = [];
  targetPackage.hotels.push({
    id: targetPackage.hotels.length + 1,
    name: '',
    location: '',
    checkIn: new Date(),
    checkOut: new Date(),
    pricePerNight: 0,
    totalPrice: 0,
    showDetails: true
  });
}

  deleteHotel(targetPackage: TravelPackage, index: number): void {
    if (targetPackage.hotels) {
      targetPackage.hotels.splice(index, 1);
    }
  }

  deleteHotelWithConfirmation(targetPackage: TravelPackage, index: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this hotel booking?');
    if (confirmation) {
      this.deleteHotel(targetPackage, index);
    }
  }

  addActivity(targetPackage: TravelPackage): void {
    if (!targetPackage.activities) targetPackage.activities = [];
    targetPackage.activities.push({
      id: targetPackage.activities.length + 1,
      name: '',
      description: '',
      type: '',
      location: '',
      date: new Date(),
      price: 0,
      showDetails: true
    });
  }

  deleteActivity(targetPackage: TravelPackage, index: number): void {
    if (targetPackage.activities) {
      targetPackage.activities.splice(index, 1);
    }
  }

  deleteActivityWithConfirmation(targetPackage: TravelPackage, index: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this activity booking?');
    if (confirmation) {
      this.deleteActivity(targetPackage, index);
    }
  }

  toggleFlightDetails(targetPackage: TravelPackage, flightIndex: number): void {
    if (targetPackage.flights) {
      const flight = targetPackage.flights[flightIndex];
      flight.showDetails = !flight.showDetails;
    }
  }

  toggleHotelDetails(targetPackage: TravelPackage, flightIndex: number): void {
    if (targetPackage.hotels) {
      const hotel = targetPackage.hotels[flightIndex];
      hotel.showDetails = !hotel.showDetails;
    }
  }

  toggleActivityDetails(targetPackage: TravelPackage, flightIndex: number): void {
    if (targetPackage.activities) {
      const activity = targetPackage.activities[flightIndex];
      activity.showDetails = !activity.showDetails;
    }
  }





}

