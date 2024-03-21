import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGalleryComponent } from './activity-gallery.component';

describe('ActivityGalleryComponent', () => {
  let component: ActivityGalleryComponent;
  let fixture: ComponentFixture<ActivityGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
