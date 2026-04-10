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

---

## Verificación por fase

1. `npm run build` — debe compilar sin errores (incluye `copy-files` para el SCSS theme)
2. Verificar que `o-gallery-theme.scss` se copia correctamente a `dist/`

---

## Decisiones

- **flex-layout**: Mantenido `@angular/flex-layout` como peer transitorio en Fases 1-2; eliminado en Fase 3 ✅
- **ontimize-web-ngx**: Usada `^15.9.0` en Fases 1-2; en Fase 3 apunta al tgz local `^18.0.0` ✅
- **luxon**: Añadido en Fase 3 como dependencia directa (peer transitivo de `ngx-material-timepicker` que viene del framework) ✅
- **Standalone**: No hay standalone components propios — no requiere migración de DI
- **SCSS theming**: `o-gallery-theme.scss` compatible con Material 18 M2 sin cambios ✅
