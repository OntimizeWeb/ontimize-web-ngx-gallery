import { Component, ElementRef, EventEmitter, HostListener, OnChanges, SimpleChange } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { InputConverter } from 'ontimize-web-ngx';

import { GalleryAction } from '../../models/gallery-action.model';
import { GalleryLayout } from '../../models/gallery-layout.model';
import { GalleryOrder } from '../../models/gallery-order.model';
import { GalleryHelperService } from '../../services/gallery-helper.service';

@Component({
  selector: 'o-gallery-thumbnails',
  templateUrl: './o-gallery-thumbnails.component.html',
  styleUrls: ['./o-gallery-thumbnails.component.scss'],
  inputs: [
    'images',
    'links',
    'labels',
    'linkTarget : link-target',
    'columns',
    'rows',
    'arrows',
    'arrowsAutoHide : arrows-auto-hide',
    'margin',
    'selectedIndex : selected-index',
    'clickable',
    'swipe',
    'size',
    'arrowPrevIcon : arrow-prev-icon',
    'arrowNextIcon : arrow-next-icon',
    'moveSize : move-size',
    'order',
    'remainingCount : remaining-count',
    'lazyLoading : lazy-loading',
    'actions',
    'layout'
  ],
  outputs: [
    'onActiveChange'
  ]
})
export class GalleryThumbnailsComponent implements OnChanges {

  thumbnailsLeft: string = '0px';
  thumbnailsMarginLeft: string = '0px';
  mouseenter: boolean;
  remainingCountValue: number;
  public layout;

  minStopIndex = 0;
  private visibleThumbnails = 0;
  private thumbnailLayoutCount: number = 0;

  set images(val: string[] | SafeResourceUrl[]) {
    this._imagesArray = val;
  }
  get images(): string[] | SafeResourceUrl[] {
    this._images = this._imagesArray;
    if (this.remainingCount) {
      this._images = this._imagesArray.slice(0, this.rows * this.columns);
    } else if (this.lazyLoading && this.order !== GalleryOrder.Row) {
      let stopIndex = 0;

      if (this.order === GalleryOrder.Column) {
        stopIndex = (this.index + this.columns + this.moveSize) * this.rows;
      } else if (this.order === GalleryOrder.Page) {
        stopIndex = this.index + ((this.columns * this.rows) * 2);
      }

      if (stopIndex <= this.minStopIndex) {
        stopIndex = this.minStopIndex;
      } else {
        this.minStopIndex = stopIndex;
      }

      this._images = this._imagesArray.slice(0, stopIndex);
    }
    return this._images;
  }
  private _images: string[] | SafeResourceUrl[] = []; // Contains images shown in this component
  private _imagesArray: string[] | SafeResourceUrl[] = []; // Contains all images received through parameter `images`

  public links: string[];
  public labels: string[];
  public linkTarget: string;
  public columns: number;
  public rows: number;
  @InputConverter()
  public arrows: boolean;
  @InputConverter()
  public arrowsAutoHide: boolean;
  public margin: number;
  public selectedIndex: number;
  @InputConverter()
  public clickable: boolean;
  @InputConverter()
  public swipe: boolean;
  public size: string;
  public arrowPrevIcon: string;
  public arrowNextIcon: string;
  public moveSize: number;
  public order: number;
  @InputConverter()
  public remainingCount: boolean;
  @InputConverter()
  public lazyLoading: boolean;
  public actions: GalleryAction[];

  onActiveChange = new EventEmitter();

  private index = 0;

  constructor(
    private sanitization: DomSanitizer,
    private elementRef: ElementRef,
    private helperService: GalleryHelperService
  ) { }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes.selectedIndex) {
      this.validateIndex();
    }

    if (changes.layout) {

      if (changes.layout.currentValue === 'thumbnails-top' || changes.layout.currentValue === 'thumbnails-bottom') {
        this.visibleThumbnails = this.columns;
        this.thumbnailLayoutCount = this.rows;
      } else {
        this.visibleThumbnails = this.rows;
        this.thumbnailLayoutCount = this.columns;
      }
    }

    if (changes.swipe) {
      this.helperService.manageSwipe(this.swipe, this.elementRef,
        'thumbnails', () => this.moveRight(), () => this.moveLeft());
    }

    if (this.images) {
      this.remainingCountValue = this.images.length - (this.rows * this.columns);
    }

  }

  @HostListener('mouseenter') onMouseEnter() {
    this.mouseenter = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.mouseenter = false;
  }

  reset(index: number): void {
    this.selectedIndex = index;
    this.setDefaultPosition();

    this.index = 0;
    this.validateIndex();
  }

  handleClick(event: Event, index: number): void {
    if (!this.hasLink(index)) {
      this.selectedIndex = index;
      this.onActiveChange.emit(index);

      event.stopPropagation();
      event.preventDefault();
    }
  }

  hasLink(index: number): boolean {
    if (this.links && this.links.length && this.links[index]) {
      return true;
    }
    return false;
  }

  moveRight(): void {
    if (this.canMoveRight) {
      this.index += this.moveSize;
      const maxIndex = this.getMaxIndex() - this.columns;

      if (this.index > maxIndex) {
        this.index = maxIndex;
      }

      this.setThumbnailsPosition();
    }
  }

  moveBottom(): void {
    if (this.canMoveBottom) {
      this.index += this.moveSize;
      const maxIndex = this.getMaxIndex() - this.rows;

      if (this.index > maxIndex) {
        this.index = maxIndex;
      }

      this.setThumbnailsPosition();
    }
  }

  moveLeft(): void {
    if (this.canMoveLeft) {
      this.index -= this.moveSize;

      if (this.index < 0) {
        this.index = 0;
      }

      this.setThumbnailsPosition();
    }
  }
  moveTop(): void {
    if (this.canMoveTop) {
      this.index -= this.moveSize;

      if (this.index < 0) {
        this.index = 0;
      }

      this.setThumbnailsPosition();
    }
  }

  get canMoveRight(): boolean {
    return this.index + this.columns < this.getMaxIndex();
  }

  get canMoveBottom(): boolean {
    return this.index + this.rows < this.getMaxIndex();
  }

  get canMoveLeft(): boolean {
    return this.index !== 0;
  }

  get canMoveTop(): boolean {
    return this.index !== 0;
  }

  getThumbnailLeft(index: number): SafeStyle {
    return this.hasHorizontalDirection() ? this.calculateIndexHorizontal(index, this.rows) : this.calculateIndexVertical(index, this.columns);

  }

  getThumbnailTop(index: number): SafeStyle {
    return this.hasHorizontalDirection() ? this.calculateIndexVertical(index, this.rows) : this.calculateIndexHorizontal(index, this.columns);
  }

  calculateIndexVertical(index: number, numThumbnailLayout: number): SafeStyle {
    let calculatedIndex;
    if (this.order === GalleryOrder.Column) {
      calculatedIndex = index % numThumbnailLayout;
    } else if (this.order === GalleryOrder.Page) {
      calculatedIndex = Math.floor(index / this.visibleThumbnails) - (Math.floor(index / (this.rows * this.columns)) * numThumbnailLayout);
    } else if (this.order === GalleryOrder.Row && this.remainingCount) {
      calculatedIndex = Math.floor(index / this.visibleThumbnails);
    } else {
      calculatedIndex = Math.floor(index / Math.ceil(this.images.length / numThumbnailLayout));
    }

    return this.getThumbnailPosition(calculatedIndex, this.visibleThumbnails);
  }
  calculateIndexHorizontal(index: number, numThumbnailLayout: number): SafeStyle {
    let calculatedIndex;

    if (this.order === GalleryOrder.Column) {
      calculatedIndex = Math.floor(index / numThumbnailLayout);
    } else if (this.order === GalleryOrder.Page) {
      calculatedIndex = (index % this.visibleThumbnails) + (Math.floor(index / (this.rows * this.columns)) * this.visibleThumbnails);
    } else if (this.order === GalleryOrder.Row && this.remainingCount) {
      calculatedIndex = index % this.visibleThumbnails;
    } else {
      calculatedIndex = index % Math.ceil(this.images.length / numThumbnailLayout);
    }
    return this.getThumbnailPosition(calculatedIndex, this.visibleThumbnails);
  }

  /* if layout is right or left, get proportion about rows else about columns*/
  get thumbnailWidth(): SafeStyle {
    return this.getThumbnailDimension(this.hasHorizontalDirection() ? this.visibleThumbnails : 1);
  }

  get thumbnailHeight(): SafeStyle {
    return this.getThumbnailDimension(this.hasHorizontalDirection() ? 1 : this.visibleThumbnails);
  }

  hasHorizontalDirection(): boolean {
    return (GalleryLayout.ThumbnailsBottom === this.layout || GalleryLayout.ThumbnailsTop === this.layout)
  }
  setThumbnailsPosition(): void {
    this.thumbnailsLeft = - ((100 / this.visibleThumbnails) * this.index) + '%';

    this.thumbnailsMarginLeft = - ((this.margin - (((this.visibleThumbnails - 1) * this.margin) / this.visibleThumbnails)) * this.index) + 'px';
  }

  setDefaultPosition(): void {
    this.thumbnailsLeft = '0px';
    this.thumbnailsMarginLeft = '0px';
  }

  get canShowArrows(): boolean {
    if (this.remainingCount) {
      return false;
    } else if (this.arrows && this.images && this.images.length > this.getVisibleCount()
      && (!this.arrowsAutoHide || this.mouseenter)) {
      return true;
    } else {
      return false;
    }
  }

  validateIndex(): void {
    if (this.images) {
      let newIndex;

      if (this.order === GalleryOrder.Column) {
        newIndex = Math.floor(this.selectedIndex / this.visibleThumbnails);
      } else {
        newIndex = this.selectedIndex % Math.ceil(this.images.length / this.visibleThumbnails);
      }

      if (this.remainingCount) {
        newIndex = 0;
      }

      if (newIndex < this.index || newIndex >= this.index + this.visibleThumbnails) {
        const maxIndex = this.getMaxIndex() - this.visibleThumbnails;
        this.index = newIndex > maxIndex ? maxIndex : newIndex;

        this.setThumbnailsPosition();
      }
    }
  }

  getFileType(fileSource: string): string {
    return this.helperService.getFileType(fileSource);
  }

  private getThumbnailPosition(index: number, count: number): SafeStyle {
    return this.getSafeStyle('calc(' + ((100 / count) * index) + '% + '
      + ((this.margin - (((count - 1) * this.margin) / count)) * index) + 'px)');
  }

  private getThumbnailDimension(count: number): SafeStyle {
    if (this.margin !== 0) {
      return this.getSafeStyle('calc(' + (100 / count) + '% - '
        + (((count - 1) * this.margin) / count) + 'px)');
    } else {
      return this.getSafeStyle('calc(' + (100 / count) + '% + 1px)');
    }
  }

  private getMaxIndex(): number {

    if (this.order === GalleryOrder.Page) {
      let maxIndex = (Math.floor(this.images.length / this.getVisibleCount()) * this.visibleThumbnails);

      if (this.images.length % this.getVisibleCount() > this.visibleThumbnails) {
        maxIndex += this.visibleThumbnails;
      } else {
        maxIndex += this.images.length % this.getVisibleCount();
      }

      return maxIndex;
    } else {
      return Math.ceil(this.images.length / this.thumbnailLayoutCount);
    }
  }

  private getVisibleCount(): number {
    return this.columns * this.rows;
  }

  private getSafeStyle(value: string): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle(value);
  }

}
