import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TravelPackage } from '../interfaces/booking.interface';

@Component({
  selector: 'app-travel-package-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './travel-package-item.component.html',
  styleUrls: ['./travel-package-item.component.css']
})
export class TravelPackageItemComponent {
  @Input() travelPackage!: TravelPackage;
}
