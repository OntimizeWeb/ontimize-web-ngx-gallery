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
