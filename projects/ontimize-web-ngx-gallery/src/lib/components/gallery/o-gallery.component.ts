import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injector,
  NgZone,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { merge, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { GalleryImageSize } from '../../models/gallery-image-size.model';
import { GalleryImage } from '../../models/gallery-image.model';
import { GalleryLayout, GalleryLayouts } from '../../models/gallery-layout.model';
import { GalleryOptions } from '../../models/gallery-options.model';
import { GalleryOrderedImage } from '../../models/gallery-ordered-image.model';
import { GalleryHelperService } from '../../services/gallery-helper.service';
import { GalleryImageComponent } from '../gallery-image/o-gallery-image.component';
import { GalleryPreviewComponent } from '../gallery-preview/o-gallery-preview.component';
import { GalleryThumbnailsComponent } from '../gallery-thumbnails/o-gallery-thumbnails.component';
import { Util } from 'ontimize-web-ngx';

export const DEFAULT_OUTPUTS_O_GALLERY = [
  'onImagesReady',
  'onChange',
  'onPreviewOpen',
  'onPreviewClose',
  'onPreviewChange'
];
export const DEFAULT_INPUTS_O_GALLERY = [
  'options: gallery-options',
  'images: gallery-images'
];

@Component({
  selector: 'o-gallery',
  templateUrl: './o-gallery.component.html',
  styleUrls: ['./o-gallery.component.scss'],
  providers: [GalleryHelperService],
  inputs: DEFAULT_INPUTS_O_GALLERY,
  outputs: DEFAULT_OUTPUTS_O_GALLERY
})
export class GalleryComponent implements AfterViewInit {
  protected subscription: Subscription = new Subscription();
  protected previewComponentPortal: ComponentPortal<GalleryPreviewComponent>;
  protected galleryOverlayRef: OverlayRef;

  set options(val: GalleryOptions[]) {
    let options = val.map(option => new GalleryOptions(option));

    // sort options
    options = [
      ...options.filter(o => o.breakpoint === undefined),
      ...options
        .filter(o => o.breakpoint !== undefined)
        .sort((a, b) => b.breakpoint - a.breakpoint)
    ];

    this._options = options;

    this.setBreakpoint();
    this.setOptions();
    this.checkFullWidth();
    if (this.currentOptions) {
      this.selectedIndex = this.currentOptions.startIndex;
    }
  }

  get options(): GalleryOptions[] {
    return this._options;
  }
  private _options: GalleryOptions[];

  set images(val: GalleryImage[]) {
    this._images = val;

    const smallImages = [];
    const mediumImages = [];
    const bigImages = [];
    const descriptions = [];
    const links = [];
    const labels = [];
    this._images.forEach((img, i) => {
      img.type = this.helperService.getFileType(img.url || img.big as string || img.medium as string || img.small as string || '');
      smallImages.push(img.small || img.medium);
      mediumImages.push(new GalleryOrderedImage({ src: img.medium, type: img.type, index: i }));
      bigImages.push(img.big || img.medium);
      descriptions.push(img.description);
      links.push(img.url);
      labels.push(img.label);
    });
    this.smallImages = smallImages;
    this.mediumImages = mediumImages;
    this.bigImages = bigImages;
    this.descriptions = descriptions;
    this.links = links;
    this.labels = labels;

    if (this.images && this.images.length) {
      this.onImagesReady.emit();
    }
  }
  get images(): GalleryImage[] {
    return this._images;
  }
  private _images: GalleryImage[];

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

  selectedIndex = 0;
  previewEnabled: boolean;

  currentOptions: GalleryOptions = new GalleryOptions({});

  private breakpoint: number | undefined = undefined;
  private prevBreakpoint: number | undefined = undefined;
  private fullWidthTimeout: any;

  @ViewChild(GalleryImageComponent, { static: false })
  galleryMainImage: GalleryImageComponent;
  @ViewChild(GalleryThumbnailsComponent, { static: false })
  thubmnails: GalleryThumbnailsComponent;

  @HostBinding('style.width') width: string;
  @HostBinding('style.height') height: string;
  @HostBinding('style.left') left: string;
  private sanitization: DomSanitizer;
  private scrollStrategy: ScrollStrategyOptions;
  private overlay: Overlay;
  private helperService: GalleryHelperService;
  private ngZone: NgZone;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private myElement: ElementRef,
    private injector: Injector
  ) {
    this.sanitization = this.injector.get<DomSanitizer>(DomSanitizer as Type<DomSanitizer>);
    this.scrollStrategy = this.injector.get<ScrollStrategyOptions>(ScrollStrategyOptions as Type<ScrollStrategyOptions>);
    this.overlay = this.injector.get<Overlay>(Overlay as Type<Overlay>);
    this.helperService = this.injector.get<GalleryHelperService>(GalleryHelperService as Type<GalleryHelperService>);
    this.ngZone = this.injector.get<NgZone>(NgZone as Type<NgZone>);
  }

  ngAfterViewInit(): void {
    if (this.galleryMainImage) {
      this.galleryMainImage.reset(this.currentOptions.startIndex);
    }

    if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails && this.images.length <= 1) {
      this.currentOptions.thumbnails = false;
      this.currentOptions.imageArrows = false;
    }

    this.checkFullWidth();
  }

  @HostListener('window:resize')
  onResize() {
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

  openPreview(index: number): void {
    this.previewEnabled = true;
    this.openGalleryPreview(index);
  }

  previewOpened(): void {
    this.onPreviewOpen.emit();

    if (this.galleryMainImage && this.galleryMainImage.autoPlay) {
      this.galleryMainImage.stopAutoPlay();
    }
  }

  previewClosed(): void {
    this.previewEnabled = false;
    this.onPreviewClose.emit();

    if (this.galleryMainImage && this.galleryMainImage.autoPlay) {
      this.galleryMainImage.startAutoPlay();
    }
    if (this.galleryOverlayRef && this.galleryOverlayRef.hasAttached()) {
      this.galleryOverlayRef.detach();
      this.galleryOverlayRef.dispose();
      this.galleryOverlayRef = null;
    }
    if (this.previewComponentPortal && this.previewComponentPortal.isAttached) {
      this.previewComponentPortal.detach();
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
    this.galleryMainImage.showNext();
  }

  showPrev(): void {
    this.galleryMainImage.showPrev();
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

  moveThumbnailsTop() {
    this.thubmnails.moveTop();
  }

  moveThumbnailsBottom() {
    this.thubmnails.moveBottom();
  }

  canMoveThumbnailsRight() {
    return this.thubmnails.canMoveRight;
  }

  canMoveThumbnailsLeft() {
    return this.thubmnails.canMoveLeft;
  }

  canMoveThumbnailsTop() {
    return this.thubmnails.canMoveTop;
  }

  canMoveThumbnailsBottom() {
    return this.thubmnails.canMoveBottom;
  }

  changeWidth(newWidth: string) {
    this.changeOptionsProp('width', newWidth);
  }

  changeHeight(newHeight: string) {
    this.changeOptionsProp('height', newHeight);
  }

  changeThumbnailsColumns(columns: number) {
    this.changeOptionsProp('thumbnailsColumns', columns);
  }

  changeThumbnailsRows(rows: number) {
    this.changeOptionsProp('thumbnailsRows', rows);
  }


  changeThumbPosition(layout: GalleryLayouts): void {
    this.options = this.options.map(o => {
      switch (layout) {
        case GalleryLayout.ThumbnailsBottom:
          o.layout = GalleryLayout.ThumbnailsBottom;
          break;
        case GalleryLayout.ThumbnailsTop:
          o.layout = GalleryLayout.ThumbnailsTop;
          break;
        case GalleryLayout.ThumbnailsLeft:
          o.layout = GalleryLayout.ThumbnailsLeft;
          break;
        case GalleryLayout.ThumbnailsRight:
          o.layout = GalleryLayout.ThumbnailsRight;
      }
      return o;
    });
  }

  get aspectRatio() {
    if (Util.isDefined(this.currentOptions.aspectRatio) && this.currentOptions.aspectRatio.indexOf(':') > -1) {
      const ratioParts = this.currentOptions.aspectRatio.split(':');
      return this.sanitization.bypassSecurityTrustStyle(ratioParts[0] + '/' + parseFloat(ratioParts[1]));

    }
    return undefined
  }
  get imageHeight() {
    if (Util.isDefined(this.currentOptions.aspectRatio)) {
      return undefined;
    } else {
      if (Util.isDefined(this.currentOptions.thumbnails) &&
        (this.currentOptions.layout === 'thumbnails-bottom' || this.currentOptions.layout === 'thumbnails-top')) {
        return this.currentOptions.imagePercent + '%'
      } else {
        return '100%';
      }
    }
  }

  get thumbnailHeight() {
    if (Util.isDefined(this.currentOptions.aspectRatio && this.currentOptions.aspectRatio.indexOf(':') > -1)) {
      if (Util.isDefined(this.thubmnails) &&
        Util.isDefined(this.currentOptions.layout) && (this.currentOptions.layout === 'thumbnails-bottom' || this.currentOptions.layout === 'thumbnails-top')) {
        const widthThumbnail = this.thubmnails.elementRef.nativeElement.querySelector('a').offsetWidth;
        const ratioParts= this.currentOptions.aspectRatio.split(':').map(x=>parseInt(x));
        const ratioPercent = !isNaN(ratioParts[0]) && !isNaN(ratioParts[1]) ? ratioParts[1] / ratioParts[0] : 1;
        return widthThumbnail*ratioPercent+'px';
      } else {
        return undefined;
      }

    } else {
      if (Util.isDefined(this.currentOptions.thumbnails) &&
        (this.currentOptions.layout === 'thumbnails-left' || this.currentOptions.layout === 'thumbnails-right')) {
        return 'calc(' + this.currentOptions.thumbnailsPercent + '% - ' + this.currentOptions.thumbnailsMargin + 'px)'
      } else {
        return '100%';
      }
    }
  }
  changeImageSize(): void {
    this.options = this.options.map(o => {
      o.imageSize = o.imageSize === GalleryImageSize.Cover ? GalleryImageSize.Contain : GalleryImageSize.Cover;
      return o;
    });
  }

  changeThumbnailSize(): void {
    this.options = this.options.map(o => {
      o.thumbnailSize = o.thumbnailSize === GalleryImageSize.Cover ? GalleryImageSize.Contain : GalleryImageSize.Cover;
      return o;
    });
  }

  changeImage(): void {
    this.toggleOptionsProp('image');
  }

  changeThumbnails(): void {
    this.toggleOptionsProp('thumbnails');
  }

  changePreview(): void {
    this.toggleOptionsProp('preview');
  }

  changeImageArrows(): void {
    this.toggleOptionsProp('imageArrows');
  }

  changePreviewArrows(): void {
    this.toggleOptionsProp('previewArrows');
  }

  changePreviewAutoPlay(): void {
    this.toggleOptionsProp('previewAutoPlay');
  }

  changePreviewDescription(): void {
    this.toggleOptionsProp('previewDescription');
  }

  changePreviewFullscreen(): void {
    this.toggleOptionsProp('previewFullscreen');
  }

  changePreviewCloseonClick(): void {
    this.toggleOptionsProp('previewCloseOnClick');
  }

  changePreviewCloseonEsc(): void {
    this.toggleOptionsProp('previewCloseOnEsc');
  }

  changePreviewKeyboardNavigation(): void {
    this.toggleOptionsProp('previewKeyboardNavigation');
  }

  changePreviewZoom(): void {
    this.toggleOptionsProp('previewZoom');
  }

  changePreviewRotate(): void {
    this.toggleOptionsProp('previewRotate');
  }

  changePreviewDownload(): void {
    this.toggleOptionsProp('previewDownload');
  }

  changeImageSwipe(): void {
    this.toggleOptionsProp('imageSwipe');
  }

  changeThumbnailsSwipe(): void {
    this.toggleOptionsProp('thumbnailsSwipe');
  }

  changePreviewSwipe(): void {
    this.toggleOptionsProp('previewSwipe');
  }


  private resetThumbnails() {
    if (this.thubmnails) {
      this.thubmnails.reset(this.currentOptions.startIndex);
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

  private setOptions(): void {
    this.currentOptions = new GalleryOptions({});

    this.options
      .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
      .forEach((opt) => this.combineOptions(this.currentOptions, opt));

    this.width = this.currentOptions.width;
    //this.height = this.currentOptions.height;
  }

  private combineOptions(first: GalleryOptions, second: GalleryOptions) {
    Object.keys(second).forEach((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
  }

  private changeOptionsProp(prop: string, newValue: any) {
    this.options = this.options.map(o => {
      o[prop] = newValue;
      return o;
    });
  }

  private toggleOptionsProp(prop: string) {
    this.options = this.options.map(o => {
      o[prop] = !o[prop];
      return o;
    });
  }

  public openGalleryPreview(index: number): void {
    if (!this.previewComponentPortal) {
      this.previewComponentPortal = new ComponentPortal<GalleryPreviewComponent>(GalleryPreviewComponent,
        this.viewContainerRef);
    }

    if (!this.galleryOverlayRef) {
      this.createGalleryOverlay(index);
    }


    if (!this.galleryOverlayRef.hasAttached()) {
      this.galleryOverlayRef.attach(this.previewComponentPortal);

      // Update the position once the calendar has rendered.
      this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this.galleryOverlayRef.updatePosition();
      });
    }
  }

  /** Create the popup. */
  protected createGalleryOverlay(index: number): void {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      panelClass: 'gallery-preview-popup',
      scrollStrategy: this.scrollStrategy.close(),
      height: '100%',
      width: '100%'
    });

    this.galleryOverlayRef = this.overlay.create(overlayConfig);
    this.attachGalleryPreview(this.galleryOverlayRef, index);

    merge(
      this.galleryOverlayRef.backdropClick(),
      this.galleryOverlayRef.detachments(),
      this.galleryOverlayRef.keydownEvents().pipe(filter(event => {
        return event.keyCode === ESCAPE ||
          (this.myElement && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe(() => this.previewClosed());
  }

  protected attachGalleryPreview(overlay: OverlayRef, index: number): void {
    const galleryPreviewContent: ComponentRef<GalleryPreviewComponent> = overlay.attach(new ComponentPortal(GalleryPreviewComponent));
    galleryPreviewContent.instance.images = this.bigImages;
    galleryPreviewContent.instance.descriptions = this.descriptions;
    galleryPreviewContent.instance.showDescription = this.currentOptions.previewDescription;
    galleryPreviewContent.instance.arrowPrevIcon = this.currentOptions.arrowPrevIcon;
    galleryPreviewContent.instance.arrowNextIcon = this.currentOptions.arrowNextIcon;
    galleryPreviewContent.instance.closeIcon = this.currentOptions.closeIcon;
    galleryPreviewContent.instance.fullscreenIcon = this.currentOptions.fullscreenIcon;
    galleryPreviewContent.instance.spinnerIcon = this.currentOptions.spinnerIcon;
    galleryPreviewContent.instance.arrows = this.currentOptions.previewArrows;
    galleryPreviewContent.instance.arrowsAutoHide = this.currentOptions.previewArrowsAutoHide;
    galleryPreviewContent.instance.swipe = this.currentOptions.previewSwipe;
    galleryPreviewContent.instance.fullscreen = this.currentOptions.previewFullscreen;
    galleryPreviewContent.instance.forceFullscreen = this.currentOptions.previewForceFullscreen;
    galleryPreviewContent.instance.closeOnClick = this.currentOptions.previewCloseOnClick;
    galleryPreviewContent.instance.closeOnEsc = this.currentOptions.previewCloseOnEsc;
    galleryPreviewContent.instance.keyboardNavigation = this.currentOptions.previewKeyboardNavigation;
    galleryPreviewContent.instance.animation = this.currentOptions.previewAnimation;
    galleryPreviewContent.instance.autoPlay = this.currentOptions.imageAutoPlay;
    galleryPreviewContent.instance.autoPlayInterval = this.currentOptions.imageAutoPlayInterval;
    galleryPreviewContent.instance.autoPlayPauseOnHover = this.currentOptions.imageAutoPlayPauseOnHover;
    galleryPreviewContent.instance.infinityMove = this.currentOptions.previewInfinityMove;
    galleryPreviewContent.instance.zoom = this.currentOptions.previewZoom;
    galleryPreviewContent.instance.zoomStep = this.currentOptions.previewZoomStep;
    galleryPreviewContent.instance.zoomMax = this.currentOptions.previewZoomMax;
    galleryPreviewContent.instance.zoomMin = this.currentOptions.previewZoomMin;
    galleryPreviewContent.instance.zoomInIcon = this.currentOptions.zoomInIcon;
    galleryPreviewContent.instance.zoomOutIcon = this.currentOptions.zoomOutIcon;
    galleryPreviewContent.instance.actions = this.currentOptions.actions;
    galleryPreviewContent.instance.rotate = this.currentOptions.previewRotate;
    galleryPreviewContent.instance.rotateLeftIcon = this.currentOptions.rotateLeftIcon;
    galleryPreviewContent.instance.rotateRightIcon = this.currentOptions.rotateRightIcon;
    galleryPreviewContent.instance.download = this.currentOptions.previewDownload;
    galleryPreviewContent.instance.downloadIcon = this.currentOptions.downloadIcon;
    galleryPreviewContent.instance.previewEnabled = this.previewEnabled;
    galleryPreviewContent.instance.aspectRatio = this.aspectRatio;

    this.subscription.add(galleryPreviewContent.instance.onClose.subscribe(() => this.previewClosed()))
    this.subscription.add(galleryPreviewContent.instance.onOpen.subscribe(() => this.previewOpened()))
    this.subscription.add(galleryPreviewContent.instance.onActiveChange.subscribe((arg) => this.previewSelect(arg)))

    galleryPreviewContent.instance.open(index || 0);
  }

}


