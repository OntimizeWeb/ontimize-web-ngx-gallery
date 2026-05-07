import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryArrowsComponent } from '../../ontimize-web-ngx-gallery.module';

describe('GalleryActionComponent', () => {
  let component: GalleryArrowsComponent;
  let fixture: ComponentFixture<GalleryArrowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryArrowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryArrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
