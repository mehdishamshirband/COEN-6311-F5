import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPackageItemComponent } from './travel-package-item.component';

describe('TravelPackageItemComponent', () => {
  let component: TravelPackageItemComponent;
  let fixture: ComponentFixture<TravelPackageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelPackageItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelPackageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
