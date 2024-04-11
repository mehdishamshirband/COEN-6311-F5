import {EventEmitter, Injectable} from '@angular/core';
import {NewTravelPackage, TravelPackage} from '../interfaces/booking.interface';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TravelPackageService {

    private travelPackages_front: TravelPackage[] = [
      {
        id: 10,
        name: 'Discover Terville',
        description: 'Experience the charm of Terville with a luxurious stay and exclusive activities.',
        price: 1500,
        startingDate: new Date(2024, 3, 10), // Dates are in format: year, monthIndex (0-based), day
        endingDate: new Date(2024, 3, 15),
        nbr_adult: 2,
        nbr_child: 0,
        photos: [
          {
            url: 'assets/images/travel-packages/terville.jpg',
            caption: 'Plan d\'eau Terville',
          }
        ],
        flights: [
          {
            id: 0,
            departureAirport: 'JFK',
            departureCity: 'New York',
            departureCountry: 'United States',
            arrivalAirport: 'IDK',
            arrivalCity: 'Terville',
            arrivalCountry: 'France',
            departureDate: new Date(2024, 3, 10, 7, 21),
            arrivalDate: new Date(2024, 3, 10, 20, 26),
            airline: 'Air Terville',
            price: 300,
            duration: 485
          }
        ],
        hotels: [
          {
            id: 0,
            hotel: {
              id: 50,
              name: "My House *****",
              location: "Terville, France",
              photos: [{
                url: 'https://example.com/hotel-terville.jpg',
                caption: 'My House ***** in Terville',
              }],
              website: "https://myhouse.com",
            },
            checkIn: new Date(2024, 3, 10),
            checkOut: new Date(2024, 3, 15),
            totalPrice: 1000,
          }
        ],
        activities: [
          {
            id: 0,
            name: "Pétanque with the Locals",
            type: "Sport",
            description: "A traditional French game of Pétanque in the heart of Terville.",
            location: "Terville Park",
            date: new Date(2024, 3, 11),
            price: 50,
            photos: [
              {
                url: 'https://example.com/petanque-terville.jpg',
                caption: 'Playing Pétanque',
              }
            ],
          }
        ],
      },{
    id: 1,
    name: 'Budapest Getaway',
    description: 'Explore the historic beauty of Budapest with exclusive tours and a luxury hotel stay.',
    price: 2500,
    startingDate: new Date(2024, 4, 20),
    endingDate: new Date(2024, 4, 25),
    nbr_adult: 2,
    nbr_child: 0,
    photos: [
      {
        url: 'assets/images/travel-packages/budapest.jpg',
        caption: 'The stunning Budapest Parliament at night',
      },
    ],
    flights: [
      {
        id: 1,
        departureAirport: 'JFK',
        departureCity: 'New York',
        departureCountry: 'United States',
        arrivalAirport: 'BUD',
        arrivalCity: 'Budapest',
        arrivalCountry: 'Hungary',
        departureDate: new Date(2024, 4, 20, 10, 12),
        arrivalDate: new Date(2024, 4, 20, 23, 26),
        airline: 'Air Hungary',
        price: 500,
        duration: 494
      },
    ],
    hotels: [
      {
        id: 1,
        hotel: {
          id: 51,
          name: "Four Seasons *****",
          location: "Budapest, Hungary",
          photos: [{
            url: 'https://example.com/hotel-budapest.jpg',
            caption: 'Four Seasons, Budapest',
          }],
          website: "https://fourseasons.com",
        },
        checkIn: new Date(2024, 4, 20),
        checkOut: new Date(2024, 4, 25),
        totalPrice: 1500,
      },
    ],
    activities: [
      {
        id: 1,
        name: "Thermal Bath Experience",
        type: "Wellness",
        description: "Relax in the world-famous thermal baths of Budapest.",
        location: "Széchenyi Thermal Bath",
        date: new Date(2024, 4, 21),
        price: 100,
        photos: [
          {
            url: 'https://example.com/bath-budapest.jpg',
            caption: 'Széchenyi Thermal Bath',
          },
        ],
      },
      {
        id: 2,
        name: "Danube River Cruise",
        type: "Sightseeing",
        description: "Enjoy a scenic cruise on the Danube with stunning views of Budapest.",
        location: "Danube River",
        date: new Date(2024, 4, 22),
        price: 150,
        photos: [
          {
            url: 'https://example.com/cruise-budapest.jpg',
            caption: 'Evening Cruise on the Danube',
          },
        ],
      }
    ],
  },
      {
    id: 2,
    name: 'Copenhagen Culture and Fun',
    description: 'Dive into the heart of Danish culture with a curated experience of Copenhagen\'s top attractions and culinary delights.',
    price: 3000,
    startingDate: new Date(2024, 6, 15),
    endingDate: new Date(2024, 6, 20),
    nbr_adult: 2,
    nbr_child: 0,
    photos: [
      {
        url: 'assets/images/travel-packages/copenhagen.jpg',
        caption: 'The colorful Nyhavn district',
      },
    ],
    flights: [
      {
        id: 2,
        departureAirport: 'JFK',
        departureCity: 'New York',
        departureCountry: 'United States',
        arrivalAirport: 'CPH',
        arrivalCity: 'Copenhagen',
        arrivalCountry: 'Denmark',
        departureDate: new Date(2024, 6, 15, 7, 55),
        arrivalDate: new Date(2024, 6, 15, 20, 46),
        airline: 'Danish Air',
        price: 400,
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/fr/b/b3/Danish_Air_Transport_logo.png',
        duration: 471
      },
    ],
    hotels: [
      {
        id: 2,
        hotel: {
          id: 52,
          name: "Hotel D'Angleterre",
          location: "Copenhagen, Denmark",
          photos: [{
            url: 'assets/images/hotels/hotel-d-angleterre-copenhague.jpg',
            caption: 'Hotel D\'Angleterre, Copenhagen',
          }],
          website: "https://www.dangleterre.com",
        },
        checkIn: new Date(2024, 6, 15),
        checkOut: new Date(2024, 6, 20),
        totalPrice: 1750,
      },
    ],
    activities: [
      {
        id: 3,
        name: "Guided Tour of The Royal Danish Opera House",
        type: "Cultural",
        description: "Explore the architectural marvel and cultural landmark of Copenhagen on a guided tour.",
        location: "The Royal Danish Opera House",
        date: new Date(2024, 6, 16),
        price: 120,
        photos: [
          {
            url: 'assets/images/activities/operaen-sommer.jpg',
            caption: 'The Royal Danish Opera House',
          },
        ],
      },
      {
        id: 4,
        name: "Culinary Experience in Copenhagen",
        type: "Food",
        description: "Savor the tastes of Denmark with a guided culinary tour through Copenhagen's famous food markets and restaurants.",
        location: "Various locations in Copenhagen",
        date: new Date(2024, 6, 17),
        price: 200,
        photos: [
          {
            url: 'https://example.com/food-tour-copenhagen.jpg',
            caption: 'Culinary tour in Copenhagen',
          },
        ],
      },
      {
        id: 5,
        name: "Canal Tour",
        type: "Sightseeing",
        description: "Experience the beauty of Copenhagen from its canals on this relaxing boat tour.",
        location: "Copenhagen Canals",
        date: new Date(2024, 6, 18),
        price: 95,
        photos: [
          {
            url: 'https://example.com/canal-tour-copenhagen.jpg',
            caption: 'Copenhagen Canal Tour',
          },
        ],
      }
    ],
    },
    {
      id: 3,
      name: 'Parisian Romance',
      description: 'Experience the romance of Paris with exclusive tours of the city\'s iconic landmarks and gourmet dining.',
      price: 4000,
      startingDate: new Date(2024, 6, 20),
      endingDate: new Date(2024, 6, 25),
      nbr_adult: 2,
      nbr_child: 0,
      photos: [
        {
        url: 'assets/images/travel-packages/paris.jpg',
          caption: 'The Eiffel Tower at sunset',
        },
      ],
      flights: [
        {
          id: 3,
          departureAirport: 'JFK',
          departureCity: 'New York',
          departureCountry: 'United States',
          arrivalAirport: 'CDG',
          arrivalCity: 'Paris',
          arrivalCountry: 'France',
          departureDate: new Date(2024, 6, 20, 21, 50),
          arrivalDate: new Date(2024, 6, 20, 10, 37),
          airline: 'Air France',
          price: 550,
          duration: 467
        },
      ],
      hotels: [
        {
          id: 3,
          hotel: {
            id: 53,
            name: "Hôtel Plaza Athénée *****",
            location: "Paris, France",
            photos: [{
              url: 'https://example.com/hotel-paris.jpg',
              caption: 'Luxury stay at Hôtel Plaza Athénée',
            }],
            website: "https://dorchestercollection.com",
          },
          checkIn: new Date(2024, 6, 20),
          checkOut: new Date(2024, 6, 25),
          totalPrice: 2500,
        },
      ],
      activities: [
        {
          id: 5,
          name: "Private Tour of The Louvre",
          type: "Art",
          description: "Enjoy a private tour of the world's largest art museum, The Louvre, with an art historian.",
          location: "The Louvre, Paris",
          date: new Date(2024, 6, 21),
          price: 250,
          photos: [
            {
              url: 'https://example.com/louvre-paris.jpg',
              caption: 'The iconic Louvre Museum',
            },
          ],
        },
        {
          id: 6,
          name: "Seine River Dinner Cruise",
          type: "Dining",
          description: "Dine on the Seine with breathtaking views of Paris at night.",
          location: "Seine River, Paris",
          date: new Date(2024, 6, 22),
          price: 300,
          photos: [
            {
              url: 'https://example.com/dinner-cruise-paris.jpg',
              caption: 'Elegant dining on the Seine',
            },
          ],
        },
      ],
    },
      {
      id: 4,
      name: 'Parisian Romance',
      description: 'Experience the romance of Paris with exclusive tours of the city\'s iconic landmarks and gourmet dining.',
      price: 4000,
      startingDate: new Date(2024, 6, 20),
      endingDate: new Date(2024, 6, 25),
      nbr_adult: 2,
      nbr_child: 0,
      photos: [
        {
        url: 'assets/images/travel-packages/paris.jpg',
          caption: 'The Eiffel Tower at sunset',
        },
      ],
      flights: [
        {
          id: 3,
          departureAirport: 'JFK',
          departureCity: 'New York',
          departureCountry: 'United States',
          arrivalAirport: 'CDG',
          arrivalCity: 'Paris',
          arrivalCountry: 'France',
          departureDate: new Date(2024, 6, 20, 14, 44),
          arrivalDate: new Date(2024, 6, 20, 3, 21),
          airline: 'Air France',
          price: 550,
          duration: 467
        },
      ],
      hotels: [
        {
          id: 4,
          hotel: {
            id: 53,
            name: "Hôtel Plaza Athénée *****",
            location: "Paris, France",
            photos: [{
              url: 'https://example.com/hotel-paris.jpg',
              caption: 'Luxury stay at Hôtel Plaza Athénée',
            }],
            website: "https://dorchestercollection.com",
          },
          checkIn: new Date(2024, 6, 20),
          checkOut: new Date(2024, 6, 25),
          totalPrice: 2500,
        },
      ],
      activities: [
        {
          id: 5,
          name: "Private Tour of The Louvre",
          type: "Art",
          description: "Enjoy a private tour of the world's largest art museum, The Louvre, with an art historian.",
          location: "The Louvre, Paris",
          date: new Date(2024, 6, 21),
          price: 250,
          photos: [
            {
              url: 'https://example.com/louvre-paris.jpg',
              caption: 'The iconic Louvre Museum',
            },
          ],
        },
        {
          id: 6,
          name: "Seine River Dinner Cruise",
          type: "Dining",
          description: "Dine on the Seine with breathtaking views of Paris at night.",
          location: "Seine River, Paris",
          date: new Date(2024, 6, 22),
          price: 300,
          photos: [
            {
              url: 'https://example.com/dinner-cruise-paris.jpg',
              caption: 'Elegant dining on the Seine',
            },
          ],
        }
      ],
    }
    ];
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8000/';
  private Package?: TravelPackage


  getAllTravelPackages(): Observable<TravelPackage[]> {
    //return this.travelPackages_front;
    console.log(this.http.get<TravelPackage[]>(this.baseUrl + 'Packages/'));
    return this.http.get<TravelPackage[]>(this.baseUrl + 'Packages/');
  }

  filterTravelPackages(filterValue: string): Observable<TravelPackage[]> {
    return this.http.get<TravelPackage[]>(this.baseUrl + 'Packages/', {params: {filterValue: filterValue}});
  }

  getTravelPackageById(id: number): Observable<TravelPackage | undefined> {
    return this.http.get<TravelPackage>(`${this.baseUrl}Packages/${id}/`)
  }

  async getTravelPackageByIdSynchronous(id: number) {
    return await lastValueFrom(this.getTravelPackageById(id)).then((data) => {
      return data;
    });
  }

  compareKeys(a:any, b:any) {
      let aKeys = Object.keys(a).sort();
      let bKeys = Object.keys(b).sort();
      return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    }

    /**
  addTravelPackage(newPackage: NewTravelPackage): Observable<TravelPackage> {
    console.log(newPackage);
    return this.http.post<TravelPackage>(this.baseUrl + 'Packages/', newPackage);
  }
**/

  addTravelPackage(formData: NewTravelPackage): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Packages/`, formData);
  }

  editTravelPackage(id: number, formData: Partial<NewTravelPackage>): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}Packages/${id}/`, formData);
  }

  onePackageById(id: number): Observable<TravelPackage> {
    this.getTravelPackageById(id)?.subscribe({next: (travelPackage) => {
        this.Package = travelPackage;
      }});
    return of(this.Package!);
  }

  localRemoveToCart(id: number): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (localCart) {
      cartData = JSON.parse(localCart);
      cartData = cartData.filter((item: TravelPackage) => item.id !== id);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  cartData = new EventEmitter<TravelPackage[]|[]>(); // Event emitter to emit the cart data
  localAddToCart(data: TravelPackage): void {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
    }
    else{
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }

  }

}
