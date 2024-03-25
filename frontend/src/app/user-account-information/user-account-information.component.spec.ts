import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountInformationComponent } from './user-account-information.component';

describe('UserAccountInformationComponent', () => {
  let component: UserAccountInformationComponent;
  let fixture: ComponentFixture<UserAccountInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
