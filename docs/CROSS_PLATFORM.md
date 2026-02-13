# Flujo recomendado (macOS + Windows)

## 1) Antes de subir a Git

```bash
npm install
npm run check:assets
npm run build
```

Si `check:assets` falla, hay rutas de fotos mal escritas en `src/data/content.ts`.

## 2) En Windows (despues de clonar)

```bash
npm install
npm run check:assets
npm run dist:win
npm run dist:win:portable
```

Modo desarrollo en Windows:

```bash
npm run dev:win
```

Modo desarrollo seguro en Windows (si ves pantalla negra/parpadeos):

```bash
npm run dev:win:safe
```

Archivos que genera:

- `release/San Valentin Andrea Setup 1.0.0.exe` (instalador, incluye desinstalador)
- `release/San Valentin Andrea 1.0.0.exe` (portable, no instala)

Nota:

- La configuracion actual usa `win.signAndEditExecutable=false` para evitar errores de permisos con symlinks de `winCodeSign` en Windows.
- Si despues quieres firmado/edicion avanzada del `.exe`, normalmente hay que ejecutar terminal como Administrador o activar "Developer Mode" en Windows.

## 3) Si en Windows se traba o se pone negro

Ejecuta en modo seguro (software render):

```bash
npm run start:safe
```

Log de diagnostico:

- `%APPDATA%\\San Valentin Andrea\\runtime-diagnostics.log`

## 4) Build para macOS

```bash
npm run dist:mac
```
