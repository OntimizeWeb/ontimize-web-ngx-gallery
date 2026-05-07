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

## FASE 2: Angular 16 → 17 — Rama `migration/17.x.x`

### Acciones previstas
- Actualizar todas las dependencias Angular a `^17.x`
- `ng-packagr` → `^17.x`, `typescript` → `~5.2.x`, `zone.js` → `~0.14.x`
- Actualizar `ontimize-web-ngx` → `^16.x` si se publica, si no mantener `^15.9.0`
- Control flow syntax opcional (`@if`, `@for`) si el tiempo lo permite

---

## FASE 3: Angular 17 → 18 — Rama `migration/18.x.x`

### Acciones previstas
- Actualizar todas las dependencias Angular a `^18.x`
- `ng-packagr` → `^18.x`, `typescript` → `~5.4.x`
- Eliminar `@angular/flex-layout`
- Actualizar `ontimize-web-ngx` → `^18.0.0` (tgz local o versión publicada)
- Revisar SCSS theming: prefijos `m2-` de Angular Material 18 (el addon ya tiene `o-gallery-theme.scss`)
- Actualizar peer deps en `projects/ontimize-web-ngx-gallery/package.json`

---

## Verificación por fase

1. `npm run build` — debe compilar sin errores (incluye `copy-files` para el SCSS theme)
2. Verificar que `o-gallery-theme.scss` se copia correctamente a `dist/`

---

## Decisiones

- **flex-layout**: Mantener `@angular/flex-layout` como peer transitorio en Fases 1-2; eliminar en Fase 3
- **ontimize-web-ngx**: Usar `^15.9.0` en Fases 1-2 hasta que se publique versión 16/17/18
- **Standalone**: No hay standalone components propios — no requiere migración de DI
- **SCSS theming**: El addon exporta `o-gallery-theme.scss` — revisar compatibilidad con Material 18 en Fase 3
