/**
 * Verifica que todos los enlaces internos del sitio construido sean correctos.
 *
 * Se ejecuta sobre `dist/`, asi que comprueba exactamente lo que se publica.
 * Se Covers cuatro aspectos:
 *
 *  1. Que ningun enlace interno se escape de la base (`/WebSite`): Astro solo
 *     antepone la base a los recursos que genera, no a los enlaces escritos a
 *     mano, y un enlace sin base apunta a la raiz del dominio.
 *  2. Que no haya separadores duplicados (`/WebSite//rss.xml`).
 *  3. Que el destino exista de verdad en `dist/`.
 *  4. Que la barra final se ajuste al tipo de destino: las paginas de
 *     directorio la necesitan y los archivos estaticos no.
 *
 *   node scripts/verificar-enlaces.mjs
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(raiz, 'dist');

/** Prefijo bajo el que se publica el sitio (ver `base` en astro.config.mjs). */
const BASE = '/WebSite';

/**
 * Recorre `dist/` y devuelve la lista de archivos HTML.
 *
 * @param {string} directorio
 * @returns {Promise<string[]>}
 */
async function listarHtml(directorio) {
  const entradas = await readdir(directorio, { withFileTypes: true });
  const archivos = [];

  for (const entrada of entradas) {
    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      archivos.push(...(await listarHtml(ruta)));
    } else if (entrada.name.endsWith('.html')) {
      archivos.push(ruta);
    }
  }

  return archivos;
}

/**
 * Extrae los destinos de los enlaces internos de un documento HTML.
 *
 * Se buscan los atributos `href` de `<a>` y `src` de `<img>`, `<script>` y
 * `<link>`. Se descartan los esquemas externos, las anclas puras y las
 * URL absolutas con esquema.
 *
 * @param {string} html
 * @returns {string[]}
 */
function extraerEnlaces(html) {
  const enlaces = [];
  const patron = /\s(?:href|src)\s*=\s*"([^"]*)"/gi;
  let coincidencia;

  while ((coincidencia = patron.exec(html)) !== null) {
    const destino = coincidencia[1].trim();
    if (!destino) continue;
    if (destino.startsWith('#')) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(destino)) continue;
    if (destino.startsWith('//')) continue;
    enlaces.push(destino);
  }

  return enlaces;
}

/**
 * Comprueba si una ruta dentro de `dist/` existe.
 *
 * @param {string} ruta
 * @returns {Promise<boolean>}
 */
async function existe(ruta) {
  if (!ruta) return true;

  const candidatos = ruta.endsWith('/')
    ? [join(ruta, 'index.html')]
    : [ruta, `${ruta}.html`, join(ruta, 'index.html')];

  for (const candidato of candidatos) {
    try {
      const info = await stat(join(dist, candidato));
      if (info.isFile() && info.size > 0) return true;
    } catch {
      // No existe: se prueba el siguiente candidato.
    }
  }

  return false;
}

/**
 * Indica si una ruta dentro de `dist/` es un archivo (no un directorio de
 * paginas).
 *
 * @param {string} ruta
 * @returns {Promise<boolean>}
 */
async function esArchivo(ruta) {
  try {
    const info = await stat(join(dist, ruta));
    return info.isFile();
  } catch {
    return false;
  }
}

/** Problemas detectados durante la revision. */
const problemas = [];

/**
 * Registra un problema encontrado.
 *
 * @param {string} origen Archivo donde se ha detectado.
 * @param {string} destino Enlace problemático.
 * @param {string} motivo Explicación breve.
 */
function anotar(origen, destino, motivo) {
  problemas.push({ origen, destino, motivo });
}

const archivos = await listarHtml(dist);

for (const archivo of archivos) {
  const html = await readFile(archivo, 'utf8');
  const origen = relative(dist, archivo).split(sep).join('/');

  for (const destino of extraerEnlaces(html)) {
    const sinFragmento = destino.split('#')[0].split('?')[0];
    if (!sinFragmento) continue;

    // 1. Todo enlace absoluto debe vivir dentro de la base.
    if (sinFragmento.startsWith('/')) {
      if (sinFragmento !== BASE && !sinFragmento.startsWith(`${BASE}/`)) {
        anotar(origen, destino, `fuera de la base ${BASE}`);
        continue;
      }
    }

    // 2. Ni la base ni el resto de la ruta pueden duplicar separadores.
    if (sinFragmento.includes('//')) {
      anotar(origen, destino, 'separadores duplicados');
      continue;
    }

    const relativa = sinFragmento.startsWith('/')
      ? sinFragmento.slice(BASE.length).replace(/^\/+/, '')
      : sinFragmento.replace(/^\.\//, '').replace(/^\/+/, '');

    // 3. El destino tiene que existir.
    if (!(await existe(relativa))) {
      anotar(origen, destino, 'el destino no existe');
      continue;
    }

    // 4. La barra final debe ajustarse al tipo de destino.
    const esPagina = !relativa || relativa.endsWith('/');
    const archivoDirecto = !esPagina && (await esArchivo(relativa));
    if (archivoDirecto && destino.endsWith('/')) {
      anotar(origen, destino, 'apunta a un archivo, no a una pagina');
    } else if (!archivoDirecto && !destino.endsWith('/') && relativa !== '') {
      anotar(origen, destino, 'falta la barra final de la pagina');
    }
  }
}

// El sitemap y el RSS deben apuntar al sitio completo, con la base incluida.
const mapas = await readdir(dist);
const feeds = mapas.filter((n) => /^sitemap.*\.xml$/.test(n) || n === 'rss.xml');

for (const feed of feeds) {
  const contenido = await readFile(join(dist, feed), 'utf8');
  const patron = /<(?:loc|link)>\s*([^<]+)\s*<\/(?:loc|link)>/g;
  let coincidencia;

  while ((coincidencia = patron.exec(contenido)) !== null) {
    const url = coincidencia[1].trim();
    // Las URL del feed son absolutas: se revisa solo su ruta.
    let ruta = url;
    try {
      ruta = new URL(url).pathname;
    } catch {
      // No es una URL absoluta: se revisa tal cual.
    }
    if (ruta !== BASE && !ruta.startsWith(`${BASE}/`)) {
      anotar(feed, url, `fuera de la base ${BASE}`);
    }
  }
}

if (problemas.length > 0) {
  console.error(`Problemas detectados: ${problemas.length}`);
  for (const problema of problemas) {
    console.error(`  ${problema.origen} -> ${problema.destino} (${problema.motivo})`);
  }
  process.exit(1);
}

console.log(`Enlaces internos correctos (${archivos.length} paginas revisadas).`);
