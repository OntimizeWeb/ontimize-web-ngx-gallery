# Migration: Angular 15 → 18 (ontimize-web-ngx-gallery)

## TL;DR

Incremental migration of the `ontimize-web-ngx-gallery` addon from Angular 15 to 18, following a branch strategy aligned with the main framework. The `ontimize-web-ngx` dependency is updated in parallel with each phase.

## Key Codebase Data

- **Minimal own dependencies**: `moment`, `@angular/material-moment-adapter`
- Uses `@angular/flex-layout@^15.0.0-beta.42` (transitional peer of `ontimize-web-ngx@15`)
- No standalone components in base version (15.x.x)
- No custom guards or complex injectors
- No additional third-party libraries

## Branch Strategy

```
15.x.x (untouched)
  └── 18.x.x (starting point, copy of 15.x.x)
       ├── migration/16.x.x (Angular 16)
       │    └── migration/17.x.x (Angular 17)
       │         └── migration/18.x.x (Angular 18 final)
       └── (final merge to 18.x.x when ready)
```

---

## PHASE 1: Angular 15 → 16 — Branch `migration/16.x.x` ✅ COMPLETED

### Actions performed

- Update all Angular dependencies to `^16.2.0`
- `ng-packagr` → `^16.2.0`, `typescript` → `~5.0.4`, `zone.js` → `~0.13.0`
- Update `tsconfig.json`: `module` → `es2022`
- `moment` → `^2.29.4`
- `ontimize-web-ngx` → `^15.9.0` (latest published 15 version)
- Keep `@angular/flex-layout@^15.0.0-beta.42` (transitional peer)
- Update `projects/ontimize-web-ngx-gallery/package.json`: peer deps to `^16.2.0`

### Compatibility notes

- `ontimize-web-ngx` has no published version 16 on npm → use `^15.9.0`
- No additional third-party libraries requiring API updates

---

## PHASE 2: Angular 16 → 17 — Branch `migration/17.x.x` ✅ COMPLETED

### Actions performed

- Update all Angular dependencies to `^17.3.0`
- `ng-packagr` → `^17.3.0`, `typescript` → `~5.2.2`, `zone.js` → `~0.14.0`
- `@angular-eslint/*` → `^17.0.0`
- `ontimize-web-ngx` → kept at `^15.9.0` (no version 16/17 published)
- Update `projects/ontimize-web-ngx-gallery/package.json`: peer deps to `^17.3.0`
- No source code changes

### Not applicable in this addon

- **Control flow migration** (`*ngIf` → `@if`): gallery templates don't use own `*ngIf`/`*ngFor`
- **`inject()` migration**: no complex custom injectors
- **Functional guards**: no custom guards
- **Standalone gradual**: handled in Phase 3

---

## PHASE 3: Angular 17 → 18 — Branch `migration/18.x.x` ✅ COMPLETED

### Actions performed

- Update all Angular dependencies to `^18.2.0`
- `ng-packagr` → `^18.2.0`, `typescript` → `~5.5.4`
- Add `luxon ^3.4.0` + `@types/luxon` (peer of `ngx-material-timepicker` transitive from framework)
- Remove `@angular/flex-layout`
- `ontimize-web-ngx` → `file:../ontimize-web-ngx/dist/ontimize-web-ngx-18.0.0-SNAPSHOT-0.tgz`
- Update `projects/ontimize-web-ngx-gallery/package.json`: peer deps to `^18.2.0`
- No source code changes (SCSS `o-gallery-theme.scss` is compatible with Material 18 M2)

### Standalone migration ✅ COMPLETED

The framework `ontimize-web-ngx@18` already has **201 standalone components** in its `migration/18.x.x` branch. The components of this addon have been migrated.

**Components to migrate:**

| Component / Directive | File |
|---|---|
| `OGalleryComponent` | `components/gallery/o-gallery.component.ts` |
| `OGalleryPreviewComponent` | `components/gallery-preview/o-gallery-preview.component.ts` |
| `OGalleryThumbnailsComponent` | `components/gallery-thumbnails/o-gallery-thumbnails.component.ts` |
| `OGalleryBulletsComponent` | `components/gallery-bullets/o-gallery-bullets.component.ts` |
| `OGalleryImageComponent` | `components/gallery-image/o-gallery-image.component.ts` |
| `OGalleryImageDirective` | `components/gallery-image/o-gallery-image.directive.ts` |
| `OGalleryActionComponent` | `components/gallery-action/o-gallery-action.component.ts` |
| `OGalleryArrowsComponent` | `components/gallery-arrows/o-gallery-arrows.component.ts` |

**Wrapper module for backward compatibility:**
- `OntimizeWebNgxGalleryModule` → re-export standalone components

**Steps:**
1. Add `standalone: true` to each component/directive
2. Move their `imports` from NgModule to the `imports` array of the `@Component` decorator
3. Keep `OntimizeWebNgxGalleryModule` wrapper re-exporting the standalone components
4. Verify build and that `o-gallery-theme.scss` is copied to `dist/`

**Note**: No technical blocker — components can be migrated independently. `GalleryComponent` already uses `inject()` in constructor, compatible with standalone. The `provideOntimizeWeb()` API is only needed for the playground (app bootstrap).

### Not applicable in this addon

- **M3 theming migration**: `o-gallery-theme.scss` uses Material M2 stable API — compatible with Angular Material 18 without changes; will be updated when framework migrates to M3
- **Typed Forms**: no use of `UntypedFormGroup`/`UntypedFormControl`
- **Functional guards**: no custom guards
- **flex-layout → native CSS**: gallery doesn't use `fxLayout` directives in own templates

---

## Verification per phase

1. `npm run build` — must compile without errors (includes `copy-files` for theme SCSS)
2. Verify `o-gallery-theme.scss` is correctly copied to `dist/`

---

## Decisions

- **flex-layout**: Kept as transitional peer in Phases 1-2; removed in Phase 3 ✅
- **ontimize-web-ngx**: Used `^15.9.0` in Phases 1-2; in Phase 3 points to local tgz `^18.0.0` ✅
- **luxon**: Added in Phase 3 as direct dependency (transitive peer of `ngx-material-timepicker` from framework) ✅
- **Standalone**: ✅ Completed — 8 components/directives migrated. `OGalleryModule` wrapper maintains backward compatibility
- **SCSS theming**: `o-gallery-theme.scss` compatible with Material 18 M2 without changes ✅
- **M3 theming**: Postponed — will be updated when `ontimize-web-ngx` publishes new M3 theming API
- **Control flow / inject() / Guards**: Not applicable — addon has no custom control structures in templates, no guards or complex DI

---

## Testing

- [ ] Phase 1: Unit tests pass on Angular 16
- [ ] Phase 2: Unit tests pass on Angular 17
- [ ] Phase 3: Unit tests pass on Angular 18
- [ ] Verify theme SCSS is exported correctly in dist
- [ ] Verify backward compatibility with `OGalleryModule` wrapper
- [ ] Build gallery in demo application working correctly
