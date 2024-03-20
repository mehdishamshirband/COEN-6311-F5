import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelPackageDetailsComponent } from './package-details.component';

describe('PackageDetailsComponent', () => {
  let component: TravelPackageDetailsComponent;
  let fixture: ComponentFixture<TravelPackageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelPackageDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelPackageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
