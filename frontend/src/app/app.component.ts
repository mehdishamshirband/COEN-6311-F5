import { Component } from '@angular/core';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TravelPackage } from './interfaces/booking.interface';
import {TravelPackageService} from "./services/travel-package.service";
import {CartService} from "./services/cart.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private scrollToTopService: ScrollToTopService, private router: Router,
              private travelPackageService: TravelPackageService, private cartService: CartService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      console.log(event);
    });
  }

  title = 'Concordia Travel';
  cartItems = 0;
  private _travelPackage?: TravelPackageService;
  public baseUrl = "http://127.0.0.1:8000/"

  ngOnInit(): void {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }
    this.cartService.cartData.subscribe((items : any) => {
      this.cartItems = items.length
    });
  }

  alreadyLoggedIn() {
    if (sessionStorage.getItem('accessToken') === null) {
      void this.router.navigate(['/login']);
    }
    else {
      void this.router.navigate(['/account']);
    }
  }


}
