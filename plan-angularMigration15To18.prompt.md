# Plan: Migración Angular 15 → 18 — ontimize-web-ngx-gallery

## TL;DR
Migración incremental del addon `ontimize-web-ngx-gallery` (Angular 15 → 18) siguiendo la misma estrategia de ramas que el framework principal. La dependencia `ontimize-web-ngx` se actualiza en paralelo con cada fase. El peer `@angular/flex-layout` se mantiene transitoriamente mientras se resuelve la dependencia de `ontimize-web-ngx`.

## Datos clave del codebase (reales)
- Dependencias propias mínimas: `moment`, `@angular/material-moment-adapter`
- Usa `@angular/flex-layout@^15.0.0-beta.42` (transitional peer de `ontimize-web-ngx@15`)
- Sin componentes standalone en la versión base (15.x.x)
- Sin guards ni inyectores propios complejos
- Sin terceros adicionales (no tiene `ngx-image-cropper`, `ngx-extended-pdf-viewer`, etc.)

## Estrategia de Ramas

```
15.x.x (intocable)
  └── 18.x.x (punto de partida, copia de 15.x.x)
       ├── migration/16.x.x (Angular 16)
       │    └── migration/17.x.x (Angular 17)
       │         └── migration/18.x.x (Angular 18 final)
       └── (merge final a 18.x.x cuando esté listo)
```

---

## FASE 1: Angular 15 → 16 — Rama `migration/16.x.x` ✅ COMPLETADO

### Acciones realizadas
- Actualizar todas las dependencias Angular a `^16.2.0`
- `ng-packagr` → `^16.2.0`, `typescript` → `~5.0.4`, `zone.js` → `~0.13.0`
- Actualizar `tsconfig.json`: `module` → `es2022`
- `moment` → `^2.29.4`
- `ontimize-web-ngx` → `^15.9.0` (última versión 15 publicada)
- Mantener `@angular/flex-layout@^15.0.0-beta.42` (peer transitorio)
- Actualizar `projects/ontimize-web-ngx-gallery/package.json`: peer deps a `^16.2.0`

### Notas de compatibilidad
- `ontimize-web-ngx` no tiene versión 16 publicada en npm → usar `^15.9.0`
- No hay terceros adicionales que requieran actualizaciones de API

---

## FASE 2: Angular 16 → 17 — Rama `migration/17.x.x` ✅ COMPLETADO

### Acciones realizadas
- Actualizar todas las dependencias Angular a `^17.3.0`
- `ng-packagr` → `^17.3.0`, `typescript` → `~5.2.2`, `zone.js` → `~0.14.0`
- `@angular-eslint/*` → `^17.0.0`
- `ontimize-web-ngx` → mantenido en `^15.9.0` (no hay versión 16/17 publicada)
- Actualizar `projects/ontimize-web-ngx-gallery/package.json`: peer deps a `^17.3.0`
- Sin cambios en código fuente

### No aplica en este addon
- **Control flow migration** (`*ngIf` → `@if`): los templates de la galería no usan `*ngIf`/`*ngFor` propios
- **Migración `inject()`**: sin inyectores propios complejos
- **Guards funcionales**: sin guards propios
- **Standalone gradual**: no hay componentes que requieran migración parcial — se gestiona en Fase 3

---

## FASE 3: Angular 17 → 18 — Rama `migration/18.x.x` ✅ COMPLETADO

### Acciones realizadas
- Actualizar todas las dependencias Angular a `^18.2.0`
- `ng-packagr` → `^18.2.0`, `typescript` → `~5.5.4`
- Añadir `luxon ^3.4.0` + `@types/luxon` (peer de `ngx-material-timepicker` transitivo del framework)
- Eliminar `@angular/flex-layout`
- `ontimize-web-ngx` → `file:../ontimize-web-ngx/dist/ontimize-web-ngx-18.0.0-SNAPSHOT-0.tgz`
- Actualizar `projects/ontimize-web-ngx-gallery/package.json`: peer deps a `^18.2.0`
- Sin cambios en código fuente (el SCSS `o-gallery-theme.scss` es compatible con Material 18 M2)

### Standalone migration ✅ COMPLETADO (commit `77e6332`)

El framework `ontimize-web-ngx@18` ya tiene **201 componentes con `standalone: true`** en su rama `migration/18.x.x`. Los componentes de este addon han sido migrados.

**Inventario de componentes a migrar:**
| Componente / Directiva | Archivo |
|---|---|
| `OGalleryComponent` | `components/gallery/o-gallery.component.ts` |
| `OGalleryPreviewComponent` | `components/gallery-preview/o-gallery-preview.component.ts` |
| `OGalleryThumbnailsComponent` | `components/gallery-thumbnails/o-gallery-thumbnails.component.ts` |
| `OGalleryBulletsComponent` | `components/gallery-bullets/o-gallery-bullets.component.ts` |
| `OGalleryImageComponent` | `components/gallery-image/o-gallery-image.component.ts` |
| `OGalleryImageDirective` | `components/gallery-image/o-gallery-image.directive.ts` |
| `OGalleryActionComponent` | `components/gallery-action/o-gallery-action.component.ts` |
| `OGalleryArrowsComponent` | `components/gallery-arrows/o-gallery-arrows.component.ts` |

**Módulo wrapper a mantener por backward compatibility:**
- `OntimizeWebNgxGalleryModule` → re-exportar standalone components

**Pasos:**
1. Añadir `standalone: true` a cada componente/directiva
2. Mover sus `imports` de NgModule al array `imports` del decorador `@Component`
3. Mantener `OntimizeWebNgxGalleryModule` wrapper re-exportando los standalone components
4. Verificar build y que `o-gallery-theme.scss` sigue copiándose a `dist/`

**Nota**: No hay bloqueo técnico — los componentes de este addon pueden migrarse a standalone independientemente del framework. La `GalleryComponent` ya usa `inject()` en el constructor (`this.injector.get()`), que es compatible con standalone. La API `provideOntimizeWeb()` solo es necesaria para la playground (bootstrap de la app).

### No aplica en este addon
- **M3 theming migration**: `o-gallery-theme.scss` usa la API M2 estable de Material — compatible sin cambios con Angular Material 18; se actualizará cuando el framework migre a M3
- **Typed Forms**: sin uso de `UntypedFormGroup`/`UntypedFormControl` propios
- **Guards funcionales**: sin guards propios
- **flex-layout → CSS nativo**: la galería no usa directivas `fxLayout` propias en sus templates

---

## Verificación por fase

1. `npm run build` — debe compilar sin errores (incluye `copy-files` para el SCSS theme)
2. Verificar que `o-gallery-theme.scss` se copia correctamente a `dist/`

---

## Decisiones

- **flex-layout**: Mantenido `@angular/flex-layout` como peer transitorio en Fases 1-2; eliminado en Fase 3 ✅
- **ontimize-web-ngx**: Usada `^15.9.0` en Fases 1-2; en Fase 3 apunta al tgz local `^18.0.0` ✅
- **luxon**: Añadido en Fase 3 como dependencia directa (peer transitivo de `ngx-material-timepicker` que viene del framework) ✅
- **Standalone**: ✅ Completado — 8 componentes/directivas migrados (`77e6332`). `OGalleryModule` wrapper mantiene backward compatibility
- **SCSS theming**: `o-gallery-theme.scss` compatible con Material 18 M2 sin cambios ✅
- **M3 theming**: Postergado — se actualizará cuando `ontimize-web-ngx` publique su nueva API de theming M3
- **Control flow / inject() / Guards**: No aplica — addon sin templates propios con estructuras de control, sin guards ni DI complejo propio
