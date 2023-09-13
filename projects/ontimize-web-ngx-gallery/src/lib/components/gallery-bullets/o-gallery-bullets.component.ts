import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryBulletsComponent {

  public count: number;
  public active: number = 0;
  onChange = new EventEmitter();

  handleChange(_event: Event, index: number): void {
    this.onChange.emit(index);
  }

  getBullets(): number[] {
    return Array(this.count);
  }
}
