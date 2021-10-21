import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'o-gallery-bullets',
  templateUrl: './o-gallery-bullets.component.html',
  styleUrls: ['./o-gallery-bullets.component.scss'],
  inputs: [
    'count',
    'active'
  ],
  outputs: [
    'onChange'
  ]
})
export class GalleryBulletsComponent {
  public count: number;
  public active: number = 0;

  onChange = new EventEmitter();

  getBullets(): number[] {
    return Array(this.count);
  }

  handleChange(_event: Event, index: number): void {
    this.onChange.emit(index);
  }
}
