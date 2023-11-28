import { ChangeDetectionStrategy, Component, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BooleanInputConverter, Util } from 'ontimize-web-ngx';

@Component({
  selector: 'o-gallery-arrows',
  templateUrl: './o-gallery-arrows.component.html',
  styleUrls: ['./o-gallery-arrows.component.scss'],
  inputs: [
    'prevDisabled: prev-disabled',
    'nextDisabled: next-disabled',
    'arrowPrevIcon: arrow-prev-icon',
    'arrowNextIcon: arrow-next-icon',
    'layout'
  ],
  outputs: [
    'onPrevClick',
    'onNextClick'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-gallery-arrows]': 'true'
  }
})
export class GalleryArrowsComponent implements OnChanges{

  @BooleanInputConverter()
  public prevDisabled: boolean;
  @BooleanInputConverter()
  public nextDisabled: boolean;
  public arrowPrevIcon: string;
  public arrowNextIcon: string;
  public layout: string;
  public position: string = 'bottom';

  onPrevClick = new EventEmitter();
  onNextClick = new EventEmitter();
  constructor() {
    this.updatePosition();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (Util.isDefined(changes.layout)) {
      this.updatePosition();
    }

  }

  updatePosition() {
    if (Util.isDefined(this.layout)) {
      this.position = this.layout.substring(this.layout.indexOf('-') + 1);
    }
  }
  handlePrevClick(): void {
    this.onPrevClick.emit();
  }

  handleNextClick(): void {
    this.onNextClick.emit();
  }

}
