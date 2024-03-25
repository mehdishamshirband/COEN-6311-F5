import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentHotelManagementComponent } from './agent-hotel-management.component';

describe('AgentHotelManagementComponent', () => {
  let component: AgentHotelManagementComponent;
  let fixture: ComponentFixture<AgentHotelManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentHotelManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentHotelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
