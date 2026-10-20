/**
 * Metadatos globales del sitio.
 *
 * Un solo lugar donde vive el nombre, la descripcion y los enlaces
 * sociales, para que la cabecera, el pie y los metadatos SEO no se
 * desincronicen.
 */
export const SITE = {
  nombre: 'FunshiEngine',
  titulo: 'FunshiEngine',
  descripcion:
    'Organización que desarrolla FunshiEngine: un motor y editor de juegos en tiempo real, sus backends de render, su interfaz de línea de comandos y sus herramientas de asistencia con IA.',
  descripcionCorta:
    'Motor y editor de juegos en tiempo real, con backends intercambiables y herramientas de IA.',
  idioma: 'es',
  locale: 'es_ES',
  url: 'https://funshiengine.github.io',
  base: '/WebSite',
  organizacion: 'FunshiEngine',
  repositorio: 'https://github.com/FunshiEngine',
  copyright: new Date().getFullYear(),
} as const;

/** Enlace a un repositorio de la organizacion. */
export function repoUrl(nombre: string): string {
  return `${SITE.repositorio}/${nombre}`;
}

/** Enlace a un archivo concreto dentro de un repositorio. */
export function repoFileUrl(nombre: string, ruta: string, rama = 'main'): string {
  return `${SITE.repositorio}/${nombre}/blob/${rama}/${ruta.replace(/^\/+/, '')}`;
}

/**
 * Prefijo bajo el que se publica el sitio.
 *
 * Astro lo inyecta desde `base` en `astro.config.mjs`. GitHub Pages sirve el
 * repositorio `FunshiEngine/WebSite` en `https://funshiengine.github.io/WebSite/`,
 * de modo que **ningun enlace interno puede empezar por `/`**: Astro solo
 * antepone la base a los recursos que genera, no a los enlaces escritos a mano.
 *
 * `import.meta.env.BASE_URL` llega con barra final (`/WebSite/`); aqui se
 * normaliza sin ella para componer rutas sin duplicar separadores.
 */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/**
 * Construye la ruta publica de una pagina interna del sitio.
 *
 * Las rutas se escriben siempre con la barra inicial y sin la base
 * (`/proyectos/`); esta funcion antepone la base y garantiza la barra final,
 * que es la que exige `trailingSlash: 'always'`.
 *
 * @param rutaInterna Ruta interna, por ejemplo `/docs/arquitectura/`.
 * @returns La ruta publica, por ejemplo `/WebSite/docs/arquitectura/`.
 */
export function ruta(rutaInterna: string): string {
  const limpia = rutaInterna.replace(/^\/+/, '').replace(/\/+$/, '');
  return limpia === '' ? `${BASE}/` : `${BASE}/${limpia}/`;
}

/**
 * Construye la ruta publica de un archivo estatico de `public/`.
 *
 * A diferencia de `ruta`, no anade barra final: `favicon.svg` y `rss.xml`
 * se sirven como archivos, no como directorios.
 *
 * @param rutaArchivo Ruta del archivo, por ejemplo `/favicon.svg`.
 * @returns La ruta publica, por ejemplo `/WebSite/favicon.svg`.
 */
export function recurso(rutaArchivo: string): string {
  return `${BASE}/${rutaArchivo.replace(/^\/+/, '')}`;
}
