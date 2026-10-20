# WebSite

Sitio de la organización FunshiEngine: presentación de la organización y
documentación por proyecto.

Es un sitio estático generado con [Astro](https://astro.build). La
documentación de cada repositorio vive en el propio sitio, escrita en MDX y
versionada junto al código que describe.

## Requisitos

- **Node.js 22.22.0 o superior** (ver `engines` en `package.json`).
- **npm 10 o superior** (se usa `npm ci` en CI).

No hace falta ningún otro toolchain: el sitio no tiene backend.

## Puesta en marcha

```bash
npm ci        # instalar dependencias
npm run dev   # servidor de desarrollo en http://localhost:4321/WebSite/
```

El servidor de desarrollo sirve el sitio bajo el prefijo `/WebSite` (ver
[La base `/WebSite`](#la-base-website)), así que la URL es
`http://localhost:4321/WebSite/` **con barra final**.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Genera el sitio estático en `dist/`. |
| `npm run preview` | Sirve `dist/` como lo hará GitHub Pages. |
| `npm run check` | TypeScript + plantillas de Astro (`astro check`). Sin errores ni avisos. |
| `npm run verificar` | Comprueba que los enlaces internos de `dist/` son correctos. |
| `npm run verificar:todo` | `check` + `build` + `verificar`, en ese orden. |
| `npm run imagenes` | Regenera `og-image.png` y `apple-touch-icon.png`. |
| `npm run astro` | CLI de Astro (`astro <comando>`). |

`npm run verificar` exige que exista un `dist/` reciente: compila antes de
verificar.

## Estructura

```
public/                  Archivos servidos tal cual (favicon, imagenes, robots.txt)
scripts/
  generar-imagenes.mjs   Genera las imagenes sociales con sharp
  verificar-enlaces.mjs  Comprueba los enlaces internos del sitio construido
src/
  components/            Componentes Astro (cabecera, pie, fichas, botones...)
  content/
    proyectos/           Fichas de los proyectos (una por repositorio)
    docs/                Documentacion en MDX
  layouts/               Plantillas de pagina
  lib/                   Utilidades compartidas (rutas, proyectos, docs)
  pages/                 Paginas y rutas del sitio
  plugins/               Plugins del pipeline de Markdown
  styles/                Tokens de diseno y estilos globales
astro.config.mjs         Configuracion de Astro
```

## La base `/WebSite`

El repositorio se publica como GitHub Pages, que sirve el sitio en
`https://funshiengine.github.io/WebSite/`. Todo el sitio vive, por tanto, bajo
el prefijo `/WebSite`, y **ningún enlace interno puede empezar por `/`**: eso
apuntaría a la raíz del dominio, fuera del sitio.

Astro solo antepone la base a los recursos que él genera (scripts, hojas de
estilo, imágenes). Los enlaces escritos a mano en plantillas y en el contenido
no se tocan, así que el repositorio los construye con dos ayudantes de
`src/lib/site.ts`:

| Ayudante | Para qué sirve | Ejemplo |
|---|---|---|
| `ruta()` | Páginas del sitio. Garantiza la barra final. | `ruta('/docs/guia/')` → `/WebSite/docs/guia/` |
| `recurso()` | Archivos estáticos de `public/`. Sin barra final. | `recurso('/favicon.svg')` → `/WebSite/favicon.svg` |

En el contenido MDX el enlace se escribe sin base:

```mdx
Ver la [guía de estilo](/docs/guia/estilo-de-codigo/).
```

El plugin `src/plugins/enlaces-base.mjs` lo antepone durante la compilación.
Es idempotente: una ruta que ya lleva la base no se toca dos veces.

`npm run verificar` es la red de seguridad: falla si algún enlace interno se
sale de la base, si duplica separadores, si no existe o si su barra final no
corresponde al tipo de destino.

## Escribir documentación

Cada página de documentación es un `.mdx` en `src/content/docs`. El frontmatter
declara los metadatos que usa el esquema de `src/content.config.ts`:

```mdx
---
titulo: Inicio
descripcion: Punto de partida para trabajar en la organizacion.
seccion: Guia
orden: 1
destacado: true
---

Cuerpo de la pagina en Markdown.
```

- `seccion` agrupa las páginas en la navegación lateral.
- `proyecto` (opcional) vincula la página a la ficha de un proyecto, de modo que
  la documentación de cada repositorio queda agrupada bajo él.
- `orden` decide la posición dentro de la sección.

La navegación lateral se arma sola a partir de `seccion` y de la ruta del
archivo (`src/lib/docs.ts`): una página cuelga de su carpeta.

Las fichas de los proyectos son archivos `.md` en `src/content/proyectos`, con
su propio esquema (`nombre`, `clave`, `lema`, `estado`, `stack`, `repositorio`,
`version`, `licencia`, `rol`, `aspectos`, `orden`).

## Publicación

El sitio se publica automáticamente en GitHub Pages con
`.github/workflows/desplegar.yml`, en cada `push` a `main`:

1. Se compila el sitio (`npm ci` y `npm run build`).
2. Se sube `dist/` como artefacto de Pages.
3. Se despliega el artefacto.

La CI (`.github/workflows/ci.yml`) corre en cada push y pull request, y ejecuta
`npm run verificar:todo` sobre Ubuntu y Windows.

Para probar localmente cómo queda publicado:

```bash
npm run build
npm run preview   # http://localhost:4321/WebSite/
```

## Diseño

- Sin framework de interfaz: solo CSS con variables propias
  (`src/styles/tokens.css`).
- Tema oscuro por defecto, con tema claro según `prefers-color-scheme`.
- Fuentes autoalojadas con `@fontsource-variable` (Newsreader, Inter,
  JetBrains Mono). No hay peticiones a terceros en tiempo de ejecución.
- Todo el movimiento respeta `prefers-reduced-motion`.

## Licencia

Apache-2.0, como el resto de la organización.
