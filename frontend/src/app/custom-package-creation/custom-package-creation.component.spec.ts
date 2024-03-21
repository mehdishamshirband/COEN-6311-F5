import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPackageCreationComponent } from './custom-package-creation.component';

describe('CustomPackageCreationComponent', () => {
  let component: CustomPackageCreationComponent;
  let fixture: ComponentFixture<CustomPackageCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPackageCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomPackageCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
