// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { pluginEnlacesBase } from './src/plugins/enlaces-base.mjs';

/**
 * Prefijo bajo el que se publica el sitio.
 *
 * GitHub Pages sirve el repositorio `FunshiEngine/WebSite` en
 * `https://funshiengine.github.io/WebSite/`. Es la unica fuente de verdad: la
 * usan tanto `base` como el plugin que corrige los enlaces del contenido.
 */
const BASE = '/WebSite';

/**
 * Configuracion del sitio de la organizacion FunshiEngine.
 *
 * El sitio se publica como GitHub Pages desde el repositorio
 * `FunshiEngine/WebSite`, por lo que vive bajo el prefijo `/WebSite`.
 */
export default defineConfig({
  site: 'https://funshiengine.github.io',
  base: BASE,
  // El sitio se sirve como paginas de directorio (`ruta/index.html`), que es
  // lo que GitHub Pages entiende. La barra final forma parte de la URL.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    // Satteri es el procesador por defecto de Astro 7. Se declara de forma
    // explicita unicamente para engancharle el plugin que antepone la base a
    // los enlaces escritos en el contenido.
    processor: satteri({
      mdastPlugins: [pluginEnlacesBase({ base: BASE })],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
