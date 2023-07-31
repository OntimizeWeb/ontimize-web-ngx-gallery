import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryActionComponent } from './o-gallery-action.component';
import { OGalleryModule } from '../../ontimize-web-ngx-gallery.module';

describe('GalleryActionComponent', () => {
  let component: GalleryActionComponent;
  let fixture: ComponentFixture<GalleryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalleryActionComponent],
      imports: [OGalleryModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
