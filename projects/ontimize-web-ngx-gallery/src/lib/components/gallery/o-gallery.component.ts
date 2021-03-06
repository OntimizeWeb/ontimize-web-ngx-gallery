import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { GalleryImageSize } from '../../models/gallery-image-size.model';
import { GalleryImage } from '../../models/gallery-image.model';
import { GalleryLayout } from '../../models/gallery-layout.model';
import { GalleryOptions } from '../../models/gallery-options.model';
import { GalleryOrderedImage } from '../../models/gallery-ordered-image.model';
import { GalleryHelperService } from '../../services/gallery-helper.service';
import { GalleryImageComponent } from '../gallery-image/o-gallery-image.component';
import { GalleryPreviewComponent } from '../gallery-preview/o-gallery-preview.component';
import { GalleryThumbnailsComponent } from '../gallery-thumbnails/o-gallery-thumbnails.component';


export const DEFAULT_OUTPUTS_O_GALLERY = [
  'onImagesReady',
  'onChange',
  'onPreviewOpen',
  'onPreviewClose',
  'onPreviewChange'
];
export const DEFAULT_INPUTS_O_GALLERY = [
  'options : gallery-options',
  'images : gallery-images'
];

@Component({
  selector: 'o-gallery',
  templateUrl: './o-gallery.component.html',
  styleUrls: ['./o-gallery.component.scss'],
  providers: [GalleryHelperService],
  inputs: DEFAULT_INPUTS_O_GALLERY,
  outputs: DEFAULT_OUTPUTS_O_GALLERY
})

export class GalleryComponent implements OnInit, DoCheck, AfterViewInit {

  public options: GalleryOptions[];
  optionsLength: number;
  public images: GalleryImage[];

  onImagesReady = new EventEmitter();
  onChange = new EventEmitter<{ index: number; image: GalleryImage; }>();
  onPreviewOpen = new EventEmitter();
  onPreviewClose = new EventEmitter();
  onPreviewChange = new EventEmitter<{ index: number; image: GalleryImage; }>();

  smallImages: string[] | SafeResourceUrl[];
  mediumImages: GalleryOrderedImage[];
  bigImages: string[] | SafeResourceUrl[];
  descriptions: string[];
  links: string[];
  labels: string[];

  oldImages: GalleryImage[];
  oldImagesLength = 0;

  selectedIndex = 0;
  previewEnabled: boolean;

  currentOptions: GalleryOptions;

  private breakpoint: number | undefined = undefined;
  private prevBreakpoint: number | undefined = undefined;
  private fullWidthTimeout: any;

  @ViewChild(GalleryPreviewComponent, { static: false }) preview: GalleryPreviewComponent;
  @ViewChild(GalleryImageComponent, { static: false }) image: GalleryImageComponent;
  @ViewChild(GalleryThumbnailsComponent, { static: false }) thubmnails: GalleryThumbnailsComponent;

  @HostBinding('style.width') width: string;
  @HostBinding('style.height') height: string;
  @HostBinding('style.left') left: string;

  constructor(private myElement: ElementRef, private helperService: GalleryHelperService) { }

  ngOnInit() {
    this.optionsLength = this.options.length;
    this.options = this.options.map((opt) => new GalleryOptions(opt));
    this.sortOptions();
    this.setBreakpoint();
    this.setOptions();
    this.checkFullWidth();
    if (this.currentOptions) {
      this.selectedIndex = this.currentOptions.startIndex as number;
    }
  }

  ngDoCheck(): void {
    this.optionsLength = this.options.length;
    this.setOptions();
    if (this.images !== undefined && (this.images.length !== this.oldImagesLength)
      || (this.images !== this.oldImages)) {
      this.oldImagesLength = this.images.length;
      this.oldImages = this.images;
      this.setImages();

      if (this.images && this.images.length) {
        this.onImagesReady.emit();
      }

      if (this.image) {
        this.image.reset(this.currentOptions.startIndex as number);
      }

      if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails
        && this.images.length <= 1) {
        this.currentOptions.thumbnails = false;
        this.currentOptions.imageArrows = false;
      }

      this.resetThumbnails();
    }
  }

  ngAfterViewInit(): void {
    this.checkFullWidth();
  }

  @HostListener('window:resize') onResize() {
    this.setBreakpoint();

    if (this.prevBreakpoint !== this.breakpoint) {
      this.setOptions();
      this.resetThumbnails();
    }

    if (this.currentOptions && this.currentOptions.fullWidth) {

      if (this.fullWidthTimeout) {
        clearTimeout(this.fullWidthTimeout);
      }

      this.fullWidthTimeout = setTimeout(() => {
        this.checkFullWidth();
      }, 200);
    }
  }

  getImageHeight(): string {
    return (this.currentOptions && this.currentOptions.thumbnails) ?
      this.currentOptions.imagePercent + '%' : '100%';
  }

  getThumbnailsHeight(): string {
    if (this.currentOptions && this.currentOptions.image) {
      return 'calc(' + this.currentOptions.thumbnailsPercent + '% - '
        + this.currentOptions.thumbnailsMargin + 'px)';
    } else {
      return '100%';
    }
  }

  getThumbnailsMarginTop(): string {
    if (this.currentOptions && this.currentOptions.layout === GalleryLayout.ThumbnailsBottom) {
      return this.currentOptions.thumbnailsMargin + 'px';
    } else {
      return '0px';
    }
  }

  getThumbnailsMarginBottom(): string {
    if (this.currentOptions && this.currentOptions.layout === GalleryLayout.ThumbnailsTop) {
      return this.currentOptions.thumbnailsMargin + 'px';
    } else {
      return '0px';
    }
  }

  openPreview(index: number): void {
    if (this.currentOptions.previewCustom) {
      this.currentOptions.previewCustom(index);
    } else {
      this.previewEnabled = true;
      this.preview.open(index);
    }
  }

  PreviewOpen(): void {
    this.onPreviewOpen.emit();

    if (this.image && this.image.autoPlay) {
      this.image.stopAutoPlay();
    }
  }

  PreviewClose(): void {
    this.previewEnabled = false;
    this.onPreviewClose.emit();

    if (this.image && this.image.autoPlay) {
      this.image.startAutoPlay();
    }
  }

  selectFromImage(index: number) {
    this.select(index);
  }

  selectFromThumbnails(index: number) {
    this.select(index);

    if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
      && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
      this.openPreview(this.selectedIndex);
    }
  }

  show(index: number): void {
    this.select(index);
  }

  showNext(): void {
    this.image.showNext();
  }

  showPrev(): void {
    this.image.showPrev();
  }

  canShowNext(): boolean {
    if (this.images && this.currentOptions) {
      return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
        ? true : false;
    } else {
      return false;
    }
  }

  canShowPrev(): boolean {
    if (this.images && this.currentOptions) {
      return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
    } else {
      return false;
    }
  }

  previewSelect(index: number) {
    this.onPreviewChange.emit({ index, image: this.images[index] });
  }

  moveThumbnailsRight() {
    this.thubmnails.moveRight();
  }

  moveThumbnailsLeft() {
    this.thubmnails.moveLeft();
  }

  canMoveThumbnailsRight() {
    return this.thubmnails.canMoveRight();
  }

  canMoveThumbnailsLeft() {
    return this.thubmnails.canMoveLeft();
  }

  changeWidth(newWidth: string) {
    for (let index = 0; index < this.optionsLength; index++) {
      this.options[index].width = newWidth;
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changeHeight(newHeight: string) {
    for (let index = 0; index < this.optionsLength; index++) {
      this.options[index].height = newHeight;
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changeThumbPosition(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].layout === GalleryLayout.ThumbnailsTop) {
        this.options[index].layout = GalleryLayout.ThumbnailsBottom;
      } else {
        this.options[index].layout = GalleryLayout.ThumbnailsTop;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changeImageSize(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].imageSize === GalleryImageSize.Cover) {
        this.options[index].imageSize = GalleryImageSize.Contain;
      } else {
        this.options[index].imageSize = GalleryImageSize.Cover;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changeThumbnailSize(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].thumbnailSize === GalleryImageSize.Cover) {
        this.options[index].thumbnailSize = GalleryImageSize.Contain;
      } else {
        this.options[index].thumbnailSize = GalleryImageSize.Cover;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changeImage(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].image === true) {
        this.options[index].image = false;
      } else {
        this.options[index].image = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changeThumbnails(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].thumbnails === true) {
        this.options[index].thumbnails = false;
      } else {
        this.options[index].thumbnails = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreview(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[0].preview === true) {
        this.options[0].preview = false;
      } else {
        this.options[0].preview = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changeImageArrows(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].imageArrows === true) {
        this.options[index].imageArrows = false;
      } else {
        this.options[index].imageArrows = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewArrows(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewArrows === true) {
        this.options[index].previewArrows = false;
      } else {
        this.options[index].previewArrows = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewAutoPlay(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewAutoPlay === true) {
        this.options[index].previewAutoPlay = false;
      } else {
        this.options[index].previewAutoPlay = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }


  changePreviewDescription(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewDescription === true) {
        this.options[index].previewDescription = false;
      } else {
        this.options[index].previewDescription = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewFullscreen(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewFullscreen === true) {
        this.options[index].previewFullscreen = false;
      } else {
        this.options[index].previewFullscreen = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewCloseonClick(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewCloseOnClick === true) {
        this.options[index].previewCloseOnClick = false;
      } else {
        this.options[index].previewCloseOnClick = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewCloseonEsc(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewCloseOnEsc === true) {
        this.options[index].previewCloseOnEsc = false;
      } else {
        this.options[index].previewCloseOnEsc = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewKeyboardNavigation(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewKeyboardNavigation === true) {
        this.options[index].previewKeyboardNavigation = false;
      } else {
        this.options[index].previewKeyboardNavigation = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewZoom(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewZoom === true) {
        this.options[index].previewZoom = false;
      } else {
        this.options[index].previewZoom = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewRotate(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewRotate === true) {
        this.options[index].previewRotate = false;
      } else {
        this.options[index].previewRotate = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }

  changePreviewDownload(): void {
    for (let index = 0; index < this.optionsLength; index++) {
      if (this.options[index].previewDownload === true) {
        this.options[index].previewDownload = false;
      } else {
        this.options[index].previewDownload = true;
      }
    }
    this.options = this.options.slice(0, this.options.length);
  }


  private resetThumbnails() {
    if (this.thubmnails) {
      this.thubmnails.reset(this.currentOptions.startIndex as number);
    }
  }

  private select(index: number) {
    this.selectedIndex = index;

    this.onChange.emit({
      index,
      image: this.images[index]
    });
  }

  private checkFullWidth(): void {
    if (this.currentOptions && this.currentOptions.fullWidth) {
      this.width = document.body.clientWidth + 'px';
      this.left = (-(document.body.clientWidth -
        this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
    }
  }

  private setImages(): void {
    this.images.forEach((img) =>
      img.type = this.helperService.getFileType(img.url as string || img.big as string || img.medium as string || img.small as string || '')
    );
    this.smallImages = this.images.map((img) => (img.small || img.medium) as string);
    this.mediumImages = this.images.map((img, i) => new GalleryOrderedImage({
      src: img.medium,
      type: img.type,
      index: i
    }));
    this.bigImages = this.images.map((img) => (img.big as string || img.medium as string));
    this.descriptions = this.images.map((img) => img.description as string);
    this.links = this.images.map((img) => img.url as string);
    this.labels = this.images.map((img) => img.label as string);
  }

  private setBreakpoint(): void {
    this.prevBreakpoint = this.breakpoint;
    let breakpoints;

    if (typeof window !== 'undefined') {
      breakpoints = this.options.filter((opt) => opt.breakpoint >= window.innerWidth)
        .map((opt) => opt.breakpoint);
    }

    if (breakpoints && breakpoints.length) {
      this.breakpoint = breakpoints.pop();
    } else {
      this.breakpoint = undefined;
    }
  }

  private sortOptions(): void {
    this.options = [
      ...this.options.filter((a) => a.breakpoint === undefined),
      ...this.options
        .filter((a) => a.breakpoint !== undefined)
        .sort((a, b) => b.breakpoint - a.breakpoint)
    ];
  }

  private setOptions(): void {
    this.currentOptions = new GalleryOptions({});

    this.options
      .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
      .map((opt) => this.combineOptions(this.currentOptions, opt));

    this.width = this.currentOptions.width as string;
    this.height = this.currentOptions.height as string;
  }

  private combineOptions(first: GalleryOptions, second: GalleryOptions) {
    Object.keys(second).map((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
  }
}

