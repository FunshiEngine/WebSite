import { getCollection, type CollectionEntry } from 'astro:content';
import { ruta } from './site';

export type Doc = CollectionEntry<'docs'>;

/** Nodo de la navegacion lateral de la documentacion. */
export interface NodoDoc {
  /** Titulo visible. */
  titulo: string;
  /** Enlace interno, con la base incluida. */
  href: string;
  /** Identificador de la pagina, para marcar la activa. */
  id: string;
  /** Paginas hijas, si las hay. */
  hijos?: NodoDoc[];
}

/**
 * Enlace interno de una pagina de documentacion.
 */
export function rutaDoc(id: string): string {
  return ruta(`/docs/${id}/`);
}

/**
 * Paginas de documentacion, ordenadas por seccion y luego por `orden`.
 */
export async function obtenerDocs(): Promise<Doc[]> {
  const docs = await getCollection('docs');
  return docs.sort((a, b) => {
    if (a.data.seccion !== b.data.seccion) {
      return a.data.seccion.localeCompare(b.data.seccion, 'es');
    }
    return a.data.orden - b.data.orden;
  });
}

/**
 * Construye el arbol de navegacion de la documentacion.
 *
 * Las paginas se agrupan por su campo `seccion`. Dentro de una seccion, la
 * jerarquia se deduce de la ruta del archivo: `proyectos/cli/comandos` cuelga
 * de `proyectos/cli`. Si una pagina intermedia no existe, sus hijas se
 * enganchan al ancestro mas cercano que si exista, de modo que ninguna pagina
 * queda oculta de la navegacion.
 */
export async function construirArbolDocs(): Promise<NodoDoc[]> {
  const docs = await obtenerDocs();

  const porSeccion = new Map<string, Doc[]>();
  for (const doc of docs) {
    const lista = porSeccion.get(doc.data.seccion) ?? [];
    lista.push(doc);
    porSeccion.set(doc.data.seccion, lista);
  }

  const arbol: NodoDoc[] = [];

  for (const paginas of porSeccion.values()) {
    const porId = new Map(paginas.map((doc) => [doc.id, doc]));
    const nodos = new Map<string, NodoDoc>();
    const raicesSeccion: NodoDoc[] = [];

    for (const doc of paginas) {
      nodos.set(doc.id, { titulo: doc.data.titulo, href: rutaDoc(doc.id), id: doc.id });
    }

    for (const doc of paginas) {
      const partes = doc.id.split('/');
      let padre: NodoDoc | undefined;

      for (let nivel = partes.length - 1; nivel > 0; nivel -= 1) {
        const candidato = nodos.get(partes.slice(0, nivel).join('/'));
        if (candidato) {
          padre = candidato;
          break;
        }
      }

      const nodo = nodos.get(doc.id);
      if (!nodo) continue;

      if (padre) {
        padre.hijos = [...(padre.hijos ?? []), nodo];
      } else {
        raicesSeccion.push(nodo);
      }
    }

    const ordenar = (nodos: NodoDoc[]): NodoDoc[] => {
      nodos.sort((a, b) => {
        const ordenA = porId.get(a.id)?.data.orden ?? 99;
        const ordenB = porId.get(b.id)?.data.orden ?? 99;
        if (ordenA !== ordenB) return ordenA - ordenB;
        return a.titulo.localeCompare(b.titulo, 'es');
      });

      for (const nodo of nodos) {
        if (nodo.hijos) nodo.hijos = ordenar(nodo.hijos);
      }

      return nodos;
    };

    arbol.push(...ordenar(raicesSeccion));
  }

  return arbol;
}

/**
 * Paginas de documentacion que pertenecen a un proyecto concreto.
 */
export async function obtenerDocsDeProyecto(clave: string): Promise<Doc[]> {
  const docs = await obtenerDocs();
  return docs.filter((d) => d.data.proyecto === clave);
}

/**
 * Documentacion relacionada con una pagina: las que comparten seccion o
 * proyecto, sin repetir la propia pagina.
 */
export async function obtenerDocsRelacionados(doc: Doc, limite = 4): Promise<Doc[]> {
  const docs = await obtenerDocs();
  const candidatos = docs.filter(
    (d) =>
      d.id !== doc.id &&
      (d.data.proyecto === doc.data.proyecto || d.data.seccion === doc.data.seccion),
  );

  return candidatos.slice(0, limite);
}
