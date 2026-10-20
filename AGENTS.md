# AGENTS.md — Convenciones para agentes de código

Guía rápida para agentes (y humanos) que trabajen en este repositorio.

## Comandos esenciales

```bash
npm ci                  # instalar dependencias
npm run check           # TypeScript + plantillas Astro (debe quedar en 0 errores)
npm run build           # generar el sitio en dist/
npm run verificar       # comprobar los enlaces internos de dist/
npm run verificar:todo  # check + build + verificar, en ese orden
```

- **`npm run verificar` necesita un `dist/` reciente.** Compila antes de
  verificar; si no, el script revisa el build anterior y su resultado no dice
  nada del código actual.
- **`npm run check` es la puerta de calidad del código**: en Astro 7 valida
  TypeScript estricto y las plantillas. Debe quedar en cero errores, cero
  avisos y cero pistas.
- **Node.js 22.22.0 o superior.** Con versiones anteriores, Astro 7 falla al
  arrancar.
- **El servidor de desarrollo y el de previsualización sirven el sitio bajo
  `/WebSite`**: `http://localhost:4321/WebSite/`, con barra final. Sin ella,
  las rutas internas no resuelven.
- **Si el build o el check fallan con `Cannot find native binding`**, el problema
  no es el proyecto: el shim `node_modules/.bin/astro.cmd` busca `node` en el
  `PATH` y en Windows el `node` del `PATH` puede ser el de MSYS2
  (`/ucrt64/bin/node.exe`), que no vale para el binding nativo de `rolldown`.
  Se arregla poniendo el Node de Program Files delante:
  `export PATH="/c/Program Files/nodejs:$PATH"`, o invocando Astro directamente
  con `node ./node_modules/astro/bin/astro.mjs build`. En CI no ocurre: el
  runner usa el Node de `actions/setup-node`.

## La base `/WebSite`: la trampa del repositorio

El sitio se publica como GitHub Pages en `https://funshiengine.github.io/WebSite/`.
Todo vive bajo ese prefijo, y **ningún enlace interno puede empezar por `/`**:
eso apunta a la raíz del dominio, fuera del sitio.

Astro solo antepone la base a los recursos que él genera. Los enlaces escritos
a mano —en plantillas y en el contenido MDX— no se tocan, así que hay que
construirlos con los ayudantes de `src/lib/site.ts`:

| Ayudante | Para qué sirve | Ejemplo |
|---|---|---|
| `ruta()` | Páginas del sitio. Garantiza la barra final. | `ruta('/docs/guia/')` → `/WebSite/docs/guia/` |
| `recurso()` | Archivos estáticos de `public/`. Sin barra final. | `recurso('/favicon.svg')` → `/WebSite/favicon.svg` |

En el contenido MDX el enlace se escribe **sin** base
(`](/docs/guia/estilo-de-codigo/)`): el plugin
`src/plugins/enlaces-base.mjs` le antepone `/WebSite` durante la compilación, y
es idempotente.

Reglas al tocar enlaces:

- **En plantillas y componentes**: `ruta()` para páginas, `recurso()` para
  archivos de `public/`. Un `href` escrito a mano es un error.
- **En contenido MDX**: enlaces con la ruta interna, sin la base y con barra
  final.
- **Al añadir una página**: nada más `ruta()` la resuelve bien; no hace falta
  tocar el plugin.
- **Antes de commitear**: `npm run verificar`. Falla si un enlace se sale de la
  base, duplica separadores, no existe o lleva mal la barra final. El
  verificador también revisa `sitemap-*.xml` y `rss.xml`.

`BASE` tiene dos fuentes de verdad que deben coincidir: la constante `BASE` de
`astro.config.mjs` (la que usa el plugin) y `import.meta.env.BASE_URL` (la que
inyecta Astro). `src/lib/site.ts` normaliza esta última quitándole la barra
final, porque Astro la entrega con ella.

## Convenciones del código

- **Idioma**: todo el texto del sitio —prosa, comentarios, identificadores y
  textos de la interfaz— está en español. Los nombres de variables y funciones
  también (`ruta()`, `recurso()`, `obtenerProyectos()`); los nombres de tipo y
  las propiedades del esquema también van en español.
- **Sin framework de interfaz**: no añadir React, Vue, Svelte, Tailwind ni
  similares. El estilo va en CSS con variables propias
  (`src/styles/tokens.css`). Una dependencia de interfaz nueva tiene que
  justificarse en el mensaje de commit.
- **Sin dependencias en tiempo de ejecución**: el sitio es estático. Todo lo que
  se pueda resolver en compilación, se resuelve en compilación.
- **Sin peticiones a terceros**: las fuentes están autoalojadas con
  `@fontsource-variable`. No añadir scripts de analítica, CDNs ni fuentes
  remotas sin motivo explícito.
- **Accesibilidad**: el sitio es navegable por teclado, los enlaces externos
  llevan `rel="noreferrer noopener"`, las imágenes tienen `alt` y todo el
  movimiento respeta `prefers-reduced-motion`.
- **Marcado**: HTML semántico, `aria-label` en los controles que solo muestran
  un icono, y `lang` en el documento.
- **Copyright**: los archivos nuevos llevan cabecera Apache 2.0 o al menos
  `SPDX-License-Identifier: Apache-2.0`.
- **Formato**: dos espacios de indentación, comillas simples, punto y coma.
  TypeScript en modo estricto (`tsconfig.json`).

## Estructura del sitio

| Ruta | Contenido |
|---|---|
| `src/pages/` | Rutas del sitio: portada, proyectos, documentación, RSS, 404. |
| `src/layouts/` | Plantillas de página (`BaseLayout`, `DocLayout`). |
| `src/components/` | Componentes Astro reutilizables. |
| `src/content/proyectos/` | Fichas de los proyectos (una por repositorio). |
| `src/content/docs/` | Documentación en MDX. |
| `src/lib/` | Utilidades compartidas: rutas, proyectos, árbol de documentación. |
| `src/plugins/` | Plugins del pipeline de Markdown. |
| `src/styles/` | Tokens de diseño y estilos globales. |
| `scripts/` | Utilidades de Node sin dependencias: imágenes y verificación de enlaces. |

### Componentes

- **`Boton.astro`** es el botón del sitio. Se usa con `variante`
  (`'primario'` o `'secundario'`), `externo` y `pequeno`. No escribir reglas
  `.boton` en los estilos de una página: ese estilo vive en el componente.
- Los estilos de un componente de Astro se compilan a selectores con atributo
  (`[data-astro-cid-*]`). **El elemento raíz de un componente hijo no hereda el
  ámbito del padre**: una regla `.bloque a` del padre no alcanza a lo que hay
  dentro de `<Boton>`. Si hace falta, usar el propio componente.

## Contenido

- **El contenido se escribe en MDX**, con el frontmatter que exige el esquema
  de `src/content.config.ts`. `astro check` valida el frontmatter: un campo mal
  escrito rompe el build.
- **La documentación refleja el código**: cuando cambia un comando, una API o
  una estructura de un repositorio de la organización, la página correspondiente
  de `src/content/docs/` se actualiza **en el mismo commit** que el cambio. No
  es un extra al final.
- **No inventar**: si un dato no está en el repositorio del proyecto o en su
  documentación, no se escribe. Si algo no se sabe, se omite o se dice que no
  se sabe.
- **Links entre páginas de documentación**: se escriben con la ruta interna y
  sin la base (`](/docs/guia/inicio/)`). El plugin se encarga del prefijo.

## Flujo de trabajo

- **Lista de tareas antes de escribir código**: si la tarea tiene más de un
  paso, armar primero la lista de pendientes y trabajar contra ella. Cada tarea
  se marca al terminarla y verificarla, no todas al final.
- **Documentación sincronizada**: la documentación no es un extra, es parte de
  la tarea. Antes de empezar, revisar los `.md` que describen el área afectada
  (`README.md`, `AGENTS.md`, los `.github/`) y corregir lo que quedó
  desactualizado.
- **Commits atómicos por tarea**: cada tarea terminada cierra con su commit,
  con mensaje convencional (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`,
  `build:`, `ci:`). El formato completo está en
  `.github/COMMIT_TEMPLATE.md`.
- **Commits solo con archivos propios**: agregar con `git add <archivos>` los
  archivos de la tarea, nunca `git add -A` ni `git add .`.
- **Sin atribuciones ajenas al cambio**: ni coautoría, ni firmas, ni menciones
  a herramientas o asistentes. Tampoco trailers `Co-authored-by`.
- **Sin referencias de gestión en los textos del proyecto**: los comentarios,
  la documentación y los textos de la interfaz describen piezas,
  comportamiento y contratos, nada más. No llevan identificadores de tareas,
  planes, fases ni estados ("pendiente", "por hacer"). Ese contexto pertenece
  a los mensajes de commit y a las issues.
- **Comandos destructivos requieren permiso**: antes de `git checkout`,
  `git reset`, `git restore` o `git clean`, pedir permiso explícito y argumentar
  en español qué se pierde.
- **Validar antes de commitear**: `npm run verificar:todo` en verde.

## Despliegue

- El sitio lo publica `.github/workflows/desplegar.yml` en cada `push` a
  `main`, con `actions/configure-pages`, `actions/upload-pages-artifact` y
  `actions/deploy-pages`.
- La CI (`.github/workflows/ci.yml`) corre `npm run verificar:todo` en Ubuntu y
  Windows en cada push y pull request.
- El build de GitHub Pages no necesita configuración extra: `base` ya apunta a
  `/WebSite` en `astro.config.mjs`.

## Verificación visual

Los cambios de estilo se comprueban en el navegador, en los dos temas:

```bash
npm run dev
```

El tema se sigue a `prefers-color-scheme`; para forzar el oscuro se usa
`--force-dark-mode` en el navegador. Una captura en headless se toma así:

```bash
chrome --headless --disable-gpu --hide-scrollbars \
  --force-dark-mode --window-size=1440,1400 \
  --screenshot="captura.png" "http://localhost:4321/WebSite/"
```

Revisar siempre, como mínimo: portada, ficha de proyecto y página de
documentación, en tema oscuro y claro.
