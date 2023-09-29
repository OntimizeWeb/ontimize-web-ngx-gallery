import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { GalleryImage, GalleryOptions } from '../../models';
import { OGalleryModule } from '../../ontimize-web-ngx-gallery.module';
import { GalleryComponent } from './o-gallery.component';


describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, CommonModule, OGalleryModule],
      declarations: [GalleryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    component.images = [
      new GalleryImage({
        small: 'assets/1-small.jpg',
        medium: 'assets/1-medium.jpg',
        big: 'assets/1-big.jpg'
      })
    ];
    component.options = [new GalleryOptions({})];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
