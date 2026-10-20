import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Estado de un proyecto de la organizacion.
 *
 * - `activo`   : el proyecto se mantiene de forma activa.
 * - `estable`  : el proyecto se mantiene, pero ya no recibe features nuevas.
 * - `experimental`: el proyecto es una apuesta y puede cambiar de forma incompatible.
 */
const estadoProyecto = z.enum(['activo', 'estable', 'experimental']);

/**
 * Proyectos de la organizacion.
 *
 * Los datos viven en `src/content/proyectos/*.md`: cada archivo es una
 * fuente de verdad para la ficha del proyecto (resumen, stack, enlaces) y
 * su cuerpo Markdown se usa como introduccion ampliada.
 */
const proyectos = defineCollection({
  loader: glob({ base: './src/content/proyectos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Nombre comercial del proyecto. */
    nombre: z.string(),
    /** Nombre corto para el breadcrumb y el titulo de la ficha. */
    clave: z.string(),
    /** Frase de una linea que resume el proyecto. */
    lema: z.string(),
    /** Estado actual dentro de la organizacion. */
    estado: estadoProyecto,
    /** Lenguajes y tecnologias principales, en orden de relevancia. */
    stack: z.array(z.string()).min(1),
    /** Repositorio principal en GitHub. */
    repositorio: z.url(),
    /** Version publicada mas reciente, si la hay. */
    version: z.string().optional(),
    /** Licencia del proyecto. */
    licencia: z.string().default('Apache-2.0'),
    /** Color de acento propio del proyecto (hex). */
    color: z.string().default('#e29a3c'),
    /** Etiqueta corta que resume el rol del proyecto en la organizacion. */
    rol: z.string(),
    /** Aspectos destacados, en formato de lista. */
    aspectos: z.array(z.string()).default([]),
    /** Orden de presentacion en la web. */
    orden: z.number().default(99),
  }),
});

/**
 * Documentacion de la organizacion.
 *
 * Cada pagina es un `.mdx` en `src/content/docs`. El campo `seccion` agrupa
 * las paginas en la navegacion lateral y `proyecto` las vincula a una ficha
 * de proyecto, de modo que la documentacion de cada proyecto queda agrupada
 * bajo el proyecto correspondiente.
 */
const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Titulo de la pagina. */
    titulo: z.string(),
    /** Resumen de una linea, usado en indices y metadatos. */
    descripcion: z.string(),
    /** Seccion de la navegacion lateral. */
    seccion: z.string(),
    /** Clave del proyecto al que pertenece la pagina (opcional). */
    proyecto: z.string().optional(),
    /** Orden dentro de la seccion. */
    orden: z.number().default(99),
    /** Marcar la pagina como destacada en el indice. */
    destacado: z.boolean().default(false),
  }),
});

export const collections = { proyectos, docs };
