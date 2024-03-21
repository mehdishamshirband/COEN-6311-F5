import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightGalleryComponent } from './flight-gallery.component';

describe('FlightGalleryComponent', () => {
  let component: FlightGalleryComponent;
  let fixture: ComponentFixture<FlightGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
