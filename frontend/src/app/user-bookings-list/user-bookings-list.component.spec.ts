import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingsListComponent } from './user-bookings-list.component';

describe('UserBookingsListComponent', () => {
  let component: UserBookingsListComponent;
  let fixture: ComponentFixture<UserBookingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBookingsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserBookingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
