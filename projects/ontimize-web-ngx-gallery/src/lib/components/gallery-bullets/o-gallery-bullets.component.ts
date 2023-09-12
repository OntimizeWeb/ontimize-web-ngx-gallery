import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';

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
export class GalleryBulletsComponent implements OnInit {

  public count: number;
  public active: number = 0;
  public countArray = [];

  onChange = new EventEmitter();

  handleChange(_event: Event, index: number): void {
    this.onChange.emit(index);
  }
  ngOnInit(): void {
    this.countArray = new Array(this.count);
  }

}
