# Migración Angular 15 → 18 — Estado actual — ontimize-web-ngx-gallery

> Última actualización: 10 abril 2026 (sesión 2)

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
