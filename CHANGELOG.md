## 8.3.0(2024-02-09)
### Feature
* New property aspectRatio in `gallery-options` and new method `changeAspectRatio`([cc6cf1f](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/cc6cf1f)) Closes [#154](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/154)

## 8.2.2(2023-11-28)
### Bug Fixes
* Fixed bug into navigation over main image that does not navigate to the last item ([15ff9e2](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/15ff9e2)) Closes [#142](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/142)

## 8.2.1 (2023-11-24)
### Bug Fixes
* Fixed problem of building distributable package ([5ec9902](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/5ec9902))

## 8.2.0 (2023-11-24)
### Features
* Added the ability to place thumbnails to the **left** or **right** of the main image ([d16c33f](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/d16c33f)) Closes [#128](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/128)
  * New types `ThumbnailsLeft` and `ThumbnailsRight` in `GalleryLayout`
  * New methods `moveThumbnailsTop`, `moveThumbnailsBottom`, `canMoveThumbnailsTop`, `canMoveThumbnailsBottom`, `changeThumbnailsColumns`, `changeThumbnailsRows`
  * Changed arrow styles
  * New file `o-gallery-theme.scss`
    In your application '*app.scss*' file you should add the library theme.

    ```
    @import 'node_modules/ontimize-web-ngx-gallery/o-gallery-theme.scss';
    @include o-gallery-theme($theme);
    ```

## 8.1.4 (2023-09-13)
### Bug Fixes
Fixed bug using `imageBullets` option since it is showing only one bullet. ([79832b8](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/79832b8)) Closes [#112](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/112)

## 8.1.3 (2023-05-23)
### Bug Fixes
* **gallery-helper-service**: Fixed problem in utility method `getFileType`  ([02327f3](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/02327f3179e9ea15568ca9a3c0198c584ab892f4))

## 8.1.2 (2023-01-09)
### Bug Fixes
* **gallery-helper-service**: Fixed warning when the file source url is relative  ([2a7ffc9](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/2a7ffc9)) Closes [#78](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/78)

## 8.1.1 (2022-09-05)
### Bug Fixes
* **gallery-helper-service**: solved error getting file type ([5185eb1](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/5185eb1)) Closes [#60](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/60)

## 8.1.0 (2022-07-15)
### Features
* **o-gallery**: New methods `changeImageSwipe`, `changeThumbnailsSwipe`,`changePreviewSwipe` ([92ca941](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/92ca941))
### Bug Fixes
* **o-gallery-preview**: Fixed issue that caused the left navigation arrow to be hidden under the menu ([c079cc5](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/c079cc5)) Closes [#24](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/24)
* Solved code smells detected by Sonar ([1a704ba](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/1a704ba)) Closes [#34](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/34)
### BREAKING CHANGES
* **o-gallery-options**:
  * now values ​​of `imageSwipe`, `thumbnailsSwipe`, `previewSwipe` inputs have been replaced by `true` by default ([5c447fa](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/5c447fa)) Closes [#36](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/36)
  * now it is not necessary to add the properties with the default values ([ffea97c](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/ffea97c))

## 8.0.3 (2022-07-07)
### Bug Fixes
* **GalleryImage**: fix image type detection when url contains query parameters ([983376d](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/983376d2b08154fd67eba224289f4f931ad17246)) Closes [#42](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/42)

## 8.0.2 (2021-10-27)
### Features
* **GalleryImage**: performance improvements ([fad3b49](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/fad3b49)) Closes [#25](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/25)

## 8.0.1 (2020-12-15)
### Features
* **GalleryImage**: allow use medium url to show all images ([d50cc6d](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/d50cc6d)) Closes [#4](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/4)

### Bug Fixes
* **o-gallery-preview**
  * Image description only shows capital letters ([616d98a](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/616d98a)) Closes [#3](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/3)
  * Base64 images are not shown in preview ([8ee255f](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/commit/8ee255f)) Closes [#4](https://github.com/OntimizeWeb/ontimize-web-ngx-gallery/issues/3)

## 8.0.0 (2020-08-20)
### DEPENDENCY UPDATES
Updated: updating libraries to use ontimize-web-ngx@8.0.0

## 4.0.0 (2019-09-23)
### Features
* **build:** initial version
