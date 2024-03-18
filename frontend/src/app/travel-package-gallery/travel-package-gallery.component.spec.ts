import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPackageGalleryComponent } from './travel-package-gallery.component';

describe('TravelPackageGalleryComponent', () => {
  let component: TravelPackageGalleryComponent;
  let fixture: ComponentFixture<TravelPackageGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelPackageGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelPackageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
