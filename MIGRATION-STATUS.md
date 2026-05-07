# Migración Angular 15 → 18 — Estado actual — ontimize-web-ngx-gallery

> Última actualización: 7 mayo 2026 (rebase ramas huérfanas + bump 18.0.0-next.0 + fixes build)

## Repositorio y ramas

| Rama | Estado |
|------|--------|
| `15.x.x` | Base original, intocable |
| `18.x.x` | Rama destino (copia de 15.x.x) |
| `migration/16.x.x` | ✅ Completado |
| `migration/17.x.x` | ✅ Completado |
| `migration/18.x.x` | ✅ Completado |

**Ruta local**: `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-gallery`

---

## ESTADO GLOBAL

| Fase | Estado | Commit |
|------|--------|--------|
| Fase 1: Angular 15→16 | ✅ Completado | `0f4601e` |
| Fase 2: Angular 16→17 | ✅ Completado | `1a1f2d5` |
| Fase 3: Angular 17→18 | ✅ Completado | `f938dca` |
| Fase 4: Standalone components | ✅ Completado | `77e6332` (pre-rebase) |
| Fase 5: Adopción framework M3 | ✅ Completado | `2e8f669` (pre-rebase) |
| Fase 6: Control flow migration | ✅ Completado | `cb72475` (pre-rebase) |
| Fase 7: Rebase a ramas huérfanas | ✅ Completado | `6f31a84` (huérfano `18.x.x`) |
| Fase 8: Versión `18.0.0-next.0` | ✅ Completado | `7101725` |
| Fase 9: Fixes build (`mat-icon`, `$any` en `getFileType`) | ✅ Completado | en curso |

---

## FASES COMPLETADAS

### Fase 1: Angular 15 → 16 — commit `0f4601e` (10 abril 2026)

**Rama**: `migration/16.x.x`

#### Dependencias actualizadas

| Paquete | De | A |
|---------|-----|-----|
| `@angular/*` | `^15.2.9` | `^16.2.0` |
| `@angular-eslint/*` | `15.2.1` | `^16.0.0` |
| `ng-packagr` | `^15.2.2` | `^16.2.0` |
| `typescript` | `~4.9.5` | `~5.0.4` |
| `zone.js` | `~0.12.0` | `~0.13.0` |
| `moment` | `^2.18.1` | `^2.29.4` |
| `ontimize-web-ngx` | `15.0.0-beta.0` | `^15.9.0` |

**`tsconfig.json`**: `module` → `es2022`

**`projects/ontimize-web-ngx-gallery/package.json`**: peer deps `@angular/common`, `@angular/core`, `@angular/cdk` → `^16.2.0`

#### Notas

- `@angular/flex-layout@^15.0.0-beta.42` se mantiene (requerido por `ontimize-web-ngx@15.9.0`)
- `ontimize-web-ngx` no tiene versión 16 publicada en npm — se usa `^15.9.0`
- No hay cambios en código fuente — solo actualizaciones de dependencias

### Fase 2: Angular 16 → 17 — commit `1a1f2d5` (10 abril 2026)

**Rama**: `migration/17.x.x`

| Paquete | De | A |
|---------|-----|-----|
| `@angular/*` | `^16.2.0` | `^17.3.0` |
| `@angular-eslint/*` | `^16.0.0` | `^17.0.0` |
| `ng-packagr` | `^16.2.0` | `^17.3.0` |
| `typescript` | `~5.0.4` | `~5.2.2` |
| `zone.js` | `~0.13.0` | `~0.14.0` |

Sin cambios en código fuente.

---

### Fase 3: Angular 17 → 18 — commit `f938dca` (10 abril 2026)

**Rama**: `migration/18.x.x`

| Paquete | De | A |
|---------|-----|-----|
| `@angular/*` | `^17.3.0` | `^18.2.0` |
| `@angular-eslint/*` | `^17.0.0` | `^18.0.0` |
| `ng-packagr` | `^17.3.0` | `^18.2.0` |
| `typescript` | `~5.2.2` | `~5.5.4` |
| `luxon` | — | `^3.4.0` (nuevo, peer de ngx-material-timepicker transitivo) |
| `@types/luxon` | — | `^3.4.0` (nuevo) |
| `@angular/flex-layout` | `^15.0.0-beta.42` | eliminado |
| `ontimize-web-ngx` | `^15.9.0` | `file:../ontimize-web-ngx/dist/ontimize-web-ngx-18.0.0-SNAPSHOT-0.tgz` |

Sin cambios en código fuente.

---

## FASE 4: Standalone migration — commit `77e6332` (10 abril 2026)

**Rama**: `migration/18.x.x`

| Componente / Directiva | Cambio |
|---|---|
| `GalleryActionComponent` | `standalone: true` |
| `GalleryArrowsComponent` | `standalone: true`, imports `CommonModule`, `MatIconModule` |
| `GalleryBulletsComponent` | `standalone: true`, imports `CommonModule` |
| `GalleryImageDirective` | `standalone: true` |
| `GalleryImageComponent` | `standalone: true`, imports `CommonModule`, `GalleryActionComponent`, `GalleryArrowsComponent`, `GalleryBulletsComponent`, `GalleryImageDirective` |
| `GalleryThumbnailsComponent` | `standalone: true`, imports `CommonModule`, `GalleryActionComponent`, `GalleryArrowsComponent`, `GalleryImageDirective` |
| `GalleryPreviewComponent` | `standalone: true`, imports `CommonModule`, `GalleryActionComponent`, `GalleryArrowsComponent`, `GalleryBulletsComponent` |
| `GalleryComponent` | `standalone: true`, imports `CommonModule`, `GalleryImageComponent`, `GalleryThumbnailsComponent` |
| `OGalleryModule` | Convertido a wrapper NgModule (`imports/exports` standalone components, eliminados `CommonModule`/`OCustomMaterialModule`/`PortalModule`) |

---

### Fase 5: Adopción del framework M3 — commit `2e8f669` (21 abril 2026)

**Rama**: `migration/18.x.x`

Tras la migración Material M2→M3 del framework (rama `theming/m3`,
commits `fdcb42da` → `ee7f3534`), el addon se actualizó para consumir
el nuevo tgz y adoptar los tokens runtime `--o-*`.

#### Cambios

| Fichero | Cambio |
|---|---|
| `projects/ontimize-web-ngx-gallery/src/lib/theming/o-gallery-theme.scss` | Mixin reescrito: `mat.get-color-from-palette($background, background)` sustituido por `var(--o-bg-background)`. El mixin ya no depende de `@angular/material` ni de un theme M2-shaped — solo emite CSS que sigue el tema activo via CSS custom properties. |
| `projects/ontimize-web-ngx-gallery/src/lib/components/gallery/o-gallery.component.spec.ts` | `GalleryComponent` movido de `declarations` a `imports`. Angular 18 TestBed rechaza componentes standalone en `declarations`. |
| `projects/ontimize-web-ngx-gallery/src/lib/components/gallery-action/o-gallery-action.component.spec.ts` | `GalleryActionComponent`: mismo fix. |
| `projects/ontimize-web-ngx-gallery/src/lib/components/gallery-arrows/o-gallery-arrows.component.spec.ts` | `GalleryArrowsComponent`: mismo fix. |
| `package-lock.json` | Regenerado al reinstalar `ontimize-web-ngx-18.0.0-SNAPSHOT-0.tgz` del framework (rama `theming/m3`). |

#### Validación

- `npx ng build ontimize-web-ngx-gallery`: ✅ 0 errores.
- `npx ng test --watch=false`: ✅ `TOTAL: 3 SUCCESS`, 0 fallos.

#### Notas

- El resto de SCSS (6 ficheros en `components/`) no necesitó cambios — no usaban APIs Material ni tenían colores hardcoded relevantes al tema.
- El addon queda listo para ser re-empaquetado (`npm pack` desde `dist/`) y consumido por la playground con el framework M3.

---

### Fase 6: Control flow migration — 29 abril 2026

**Rama**: `migration/18.x.x`

Migración de la sintaxis estructural antigua a la nueva sintaxis de control flow de Angular 17+.

| Template | `*ngFor` → `@for` | `*ngIf` → `@if` |
|---|---|---|
| `o-gallery-thumbnails.component.html` | 2 | 3 |
| `o-gallery.component.html` | — | 2 |
| `o-gallery-bullets.component.html` | 1 | — |
| `o-gallery-image.component.html` | 3 | 4 |
| `o-gallery-preview.component.html` | 1 | 8 |

**Nota**: El compilador de Angular 18 es más estricto con el tipo `string | SafeResourceUrl` dentro de `@for` que con `*ngFor`. Se añadió `$any()` en los bindings `[oGalleryBackgroundImg]` y `[src]` del template `o-gallery-thumbnails.component.html` para mantener el comportamiento original.

---

### Fase 7: Rebase a ramas huérfanas — 7 mayo 2026

**Cambio estructural en remoto** alineando gallery con la estrategia de los demás addons (charts, map, report, extra-components):

- `18.x.x` reescrita como rama **huérfana** (sin historia común con `15.x.x`) — commit raíz `6f31a84` (snapshot del código v15)
- `migration/16.x.x` → rebasada sobre el huérfano
- `migration/17.x.x` → rebasada sobre `migration/16.x.x`
- `migration/18.x.x` → rebasada sobre `migration/17.x.x`

Las 4 ramas remotas tienen genealogía limpia:
```
18.x.x (huérfana)                       6f31a84
  └─ migration/16.x.x  (+2 commits)     dc882b0
       └─ migration/17.x.x  (+1 commit)  6988149
            └─ migration/18.x.x  (+13 commits) 5b54a34 → 9a63aa7
```

Working tree validado: `git diff` entre HEAD anterior y nuevo HEAD = vacío (ningún cambio perdido). Force-push completado a las 4 ramas remotas.

---

### Fase 8: Versión `18.0.0-next.0` — commit `7101725` (7 mayo 2026)

| Fichero | Cambio |
|---|---|
| `package.json` | `version`: `18.0.0-SNAPSHOT-0` → `18.0.0-next.0` · `ontimize-web-ngx`: `file:.../tgz` → `18.0.0-next.1` |
| `projects/ontimize-web-ngx-gallery/package.json` | `version`: `18.0.0-SNAPSHOT-0` → `18.0.0-next.0` |
| `package-lock.json` | Regenerado |
| `MIGRATION-ISSUE.md` | Añadido (commit `9a63aa7`) — describe fases 1-3 para issue de migración |

---

### Fase 9: Fixes build — 7 mayo 2026

Errores de compilación en modo Ivy estricto de Angular 18 al rebuilder con la nueva versión.

#### `getFileType($any(image))` en `o-gallery-thumbnails.component.html`

`images: string[] | SafeResourceUrl[]`, pero `getFileType(fileSource: string)` solo acepta `string`. Causa: `TS2345: Argument of type 'string | SafeResourceUrl' is not assignable to parameter of type 'string'`.

Aplicado `$any(image)` a las 2 llamadas (líneas 14 y 19), consistente con el patrón ya usado en `[oGalleryBackgroundImg]="$any(image)"` (línea 15) y `<source [src]="$any(image)">` (línea 23).

#### `MatIconModule` en componentes standalone

`mat-icon` aparece en templates pero `MatIconModule` no estaba importado en standalone components. Causa: `NG8001: 'mat-icon' is not a known element`.

| Componente | Cambio |
|---|---|
| `GalleryActionComponent` | Sin `imports[]` declarados → añadidos `imports: [MatIconModule]` |
| `GalleryPreviewComponent` | `imports[]` ya existía, añadido `MatIconModule` al array |

---

## PENDIENTE

Ninguno — migración completa ✅

---

## WORKFLOW DE BUILD

```bash
export PATH="$HOME/AppData/Local/nvs/node/20.18.3/x64:$PATH"

cd C:/work/ontimize-web-ngx/18.x.x/ontimize-web-ngx-gallery
npm install --legacy-peer-deps
npm run build
# build incluye: ng build + copy-files (copia o-gallery-theme.scss a dist/)
```
