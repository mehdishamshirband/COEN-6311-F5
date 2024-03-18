import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPackagesComponent } from './agent-packages.component';

describe('AgentPackagesComponent', () => {
  let component: AgentPackagesComponent;
  let fixture: ComponentFixture<AgentPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
