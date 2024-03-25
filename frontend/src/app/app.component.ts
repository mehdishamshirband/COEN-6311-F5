import { Component } from '@angular/core';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TravelPackage } from './interfaces/booking.interface';
import {TravelPackageService} from "./services/travel-package.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private scrollToTopService: ScrollToTopService, private router: Router,
              private travelPackageService: TravelPackageService,) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      console.log(event);
    });
  }

  title = 'Concordia Travel';
  cartItems = 0;
  private _travelPackage?: TravelPackageService;

  ngOnInit(): void {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }
    this.travelPackageService.cartData.subscribe((items : any) => {
      this.cartItems = items.length
    });
  }


}
