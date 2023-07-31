import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryComponent } from './o-gallery.component';
import { OGalleryModule } from '../../ontimize-web-ngx-gallery.module';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalleryComponent],
      imports: [OGalleryModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
