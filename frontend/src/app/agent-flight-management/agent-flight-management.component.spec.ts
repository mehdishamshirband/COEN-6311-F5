import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFlightManagementComponent } from './agent-flight-management.component';

describe('AgentFlightManagementComponent', () => {
  let component: AgentFlightManagementComponent;
  let fixture: ComponentFixture<AgentFlightManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentFlightManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentFlightManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
