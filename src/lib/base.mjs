/**
 * Prefijo bajo el que se publica el sitio.
 *
 * GitHub Pages sirve el repositorio `FunshiEngine/WebSite` en
 * `https://funshiengine.github.io/WebSite/`, de modo que todo el sitio vive
 * bajo ese prefijo.
 *
 * Este modulo es la unica fuente de verdad del prefijo: lo usan la
 * configuracion de Astro (`base` y el plugin que corrige los enlaces del
 * contenido) y las funciones que construyen las rutas publicas
 * (`src/lib/site.ts`). Vive en `.mjs` porque `astro.config.mjs` lo importa
 * directamente y Node no carga TypeScript.
 */
export const BASE = '/WebSite';

export default BASE;
