import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {TravelPackageItemComponent} from "../travel-package-item/travel-package-item.component";

@Component({
  selector: 'app-cart',
  standalone: true,
    imports: [
        NgForOf,
        TravelPackageItemComponent
    ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  get user_cart(): any {
    return JSON.parse(localStorage.getItem('localCart')!);
  }

}
