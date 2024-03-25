import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentActivityManagementComponent } from './agent-activity-management.component';

describe('AgentActivityManagementComponent', () => {
  let component: AgentActivityManagementComponent;
  let fixture: ComponentFixture<AgentActivityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentActivityManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentActivityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
