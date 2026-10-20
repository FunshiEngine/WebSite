import rss from '@astrojs/rss';
import { BASE, SITE, ruta } from '../lib/site';
import { obtenerProyectos } from '../lib/proyectos';
import { obtenerDocs } from '../lib/docs';

/**
 * Canal RSS con las paginas de documentacion de la organizacion.
 */
export async function GET(context: { site: URL }) {
  const docs = await obtenerDocs();
  const proyectos = await obtenerProyectos();

  const items = [
    ...docs.map((doc) => ({
      title: doc.data.titulo,
      description: doc.data.descripcion,
      link: ruta(`/docs/${doc.id}/`),
      pubDate: new Date(),
      categories: [doc.data.seccion],
    })),
    ...proyectos.map((proyecto) => ({
      title: proyecto.data.nombre,
      description: proyecto.data.lema,
      link: ruta(`/proyectos/${proyecto.data.clave}/`),
      pubDate: new Date(),
      categories: ['Proyectos'],
    })),
  ];

  // El canal se publica bajo la misma base que el resto del sitio.
  const sitio = new URL(`${BASE}/`, context.site ?? SITE.url);

  return rss({
    title: SITE.titulo,
    description: SITE.descripcion,
    site: sitio,
    trailingSlash: true,
    items,
    customData: `<language>es-es</language>`,
  });
}
