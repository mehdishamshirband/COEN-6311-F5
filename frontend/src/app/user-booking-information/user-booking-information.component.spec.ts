import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingInformationComponent } from './user-booking-information.component';

describe('UserBookingInformationComponent', () => {
  let component: UserBookingInformationComponent;
  let fixture: ComponentFixture<UserBookingInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBookingInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserBookingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
