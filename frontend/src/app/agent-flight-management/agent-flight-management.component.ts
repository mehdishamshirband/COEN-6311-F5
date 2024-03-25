import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Flight } from "../interfaces/booking.interface";

@Component({
  selector: 'app-agent-flight-management',
  templateUrl: './agent-flight-management.component.html',
})
export class AgentFlightManagementComponent {
  @Input() flights: Flight[] = [];
  @Output() flightsChange = new EventEmitter<Flight[]>();
  editingFlight?: Flight;

  constructor() { }

  initNewFlight(): void {
    this.editingFlight = {
      id: Date.now(),
      departureAirport: '',
      departureCity: '',
      departureCountry: '',
      arrivalAirport: '',
      arrivalCity: '',
      arrivalCountry: '',
      departureDate: new Date(),
      arrivalDate: new Date(),
      airline: '',
      duration: 0,
      price: 0
    };
  }

  startEditingFlight(flightId: number, event: MouseEvent): void {
    event.preventDefault();
    const flight = this.flights.find(f => f.id === flightId);
    if (flight) {
      this.editingFlight = JSON.parse(JSON.stringify(flight));
    }
  }

  saveFlight(): void {
    if (!this.editingFlight) return;
    const index = this.flights.findIndex(f => f.id === this.editingFlight!.id);
    if (index > -1) {
      this.flights[index] = this.editingFlight;
    } else {
      this.flights.push(this.editingFlight);
    }
    this.flightsChange.emit(this.flights);
    this.editingFlight = undefined;
  }

  cancelEditingFlight(): void {
    this.editingFlight = undefined;
  }

  deleteFlight(index: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.flights.splice(index, 1);
    this.flightsChange.emit(this.flights);
  }
}
