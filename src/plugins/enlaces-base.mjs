/**
 * Reescribe las rutas internas del contenido para que incluyan la base del
 * sitio.
 *
 * Astro solo antepone `base` a los recursos que el genera (scripts, hojas de
 * estilo, imagenes), no a los enlaces escritos a mano. En el contenido
 * Markdown y MDX los enlaces son texto, asi que no se pueden resolver en
 * tiempo de plantilla: se corrigen aqui, sobre el arbol sintactico, antes de
 * generar el HTML.
 *
 * El plugin encaja en el pipeline de Satteri como plugin `mdast`, con su
 * propio visitante por tipo de nodo:
 *
 *   satteri({ mdastPlugins: [pluginEnlacesBase({ base: '/WebSite' })] })
 *
 * La reescritura es idempotente: una ruta que ya lleva la base no se toca,
 * de modo que el contenido puede escreverla como prefiera.
 */

/**
 * Normaliza una ruta interna anadiendo la base del sitio.
 *
 * Se ignoran las URL con esquema (`https:`), las protocolorrelativas (`//`)
 * y las que ya empiezan por la base.
 *
 * @param {string} url URL original del enlace.
 * @param {string} base Prefijo de publicacion, por ejemplo `/WebSite`.
 * @returns La URL reescrita, o la original si no procede cambiarla.
 */
export function conBase(url, base) {
  if (typeof url !== 'string' || !url.startsWith('/')) return url;
  if (url.startsWith('//')) return url;
  if (!base) return url;
  if (url === base || url.startsWith(`${base}/`)) return url;
  return `${base}${url}`;
}

/**
 * Crea el plugin de reescritura de enlaces internos.
 *
 * @param {{ base?: string }} opciones
 * @returns Plugin `mdast` de Satteri.
 */
export function pluginEnlacesBase(opciones = {}) {
  const base = opciones.base ?? '';

  /**
   * @param {any} nodo Nodo `link`, `image` o `definition`.
   * @param {any} ctx Contexto del visitante de Satteri.
   */
  function reescribir(nodo, ctx) {
    const url = conBase(nodo.url, base);
    if (url !== nodo.url) {
      ctx.setProperty(nodo, 'url', url);
    }
  }

  return {
    name: 'enlaces-base',
    link: reescribir,
    image: reescribir,
    definition: reescribir,
  };
}

export default pluginEnlacesBase;
