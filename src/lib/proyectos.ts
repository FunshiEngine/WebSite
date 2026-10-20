import { getCollection, type CollectionEntry } from 'astro:content';

export type Proyecto = CollectionEntry<'proyectos'>;

/**
 * Proyectos de la organizacion, ordenados por el campo `orden`.
 */
export async function obtenerProyectos(): Promise<Proyecto[]> {
  const proyectos = await getCollection('proyectos');
  return proyectos.sort((a, b) => a.data.orden - b.data.orden);
}

/**
 * Un proyecto por su clave. Devuelve `undefined` si no existe.
 */
export async function obtenerProyecto(clave: string): Promise<Proyecto | undefined> {
  const proyectos = await obtenerProyectos();
  return proyectos.find((p) => p.data.clave === clave);
}

/**
 * Ruta publica de la ficha de un proyecto.
 */
export function rutaProyecto(clave: string): string {
  return `/proyectos/${clave}/`;
}

/**
 * Etiqueta legible para el estado de un proyecto.
 */
export const ETIQUETAS_ESTADO: Record<Proyecto['data']['estado'], string> = {
  activo: 'En desarrollo',
  estable: 'Estable',
  experimental: 'Experimental',
};
