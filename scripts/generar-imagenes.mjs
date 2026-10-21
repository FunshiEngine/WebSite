/**
 * Genera los imagenes estaticos del sitio a partir de su definicion SVG:
 * el icono de la pestana, la imagen para redes sociales y el icono de
 * Apple.
 *
 * Se ejecuta a mano cuando cambia el diseno (`npm run imagenes`); el
 * resultado se versiona en `public/` para que el sitio no dependa de una
 * operacion de build adicional.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destino = resolve(raiz, 'public');

/**
 * Inicial de la organizacion, dibujada con trazos.
 *
 * El sitio no lleva un emblema: en los iconos va la inicial, que es
 * tipografia y no un simbolo inventado.
 */
const inicial = `<g fill="#f0b862">
    <rect x="11.5" y="6" width="3.4" height="20"/>
    <rect x="11.5" y="6" width="10.5" height="3.4"/>
    <rect x="11.5" y="14.3" width="8" height="3.4"/>
  </g>`;

/** Icono de la pestana del navegador: 32x32, con esquinas redondeadas. */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7" fill="#0b0d12"/>
  ${inicial}
</svg>`;

/** Imagen para redes sociales: 1200x630. */
const ogImage = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#07080b"/>
  <rect width="1200" height="5" fill="#e29a3c"/>

  <text x="80" y="140" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="36" font-weight="600" fill="#f2f4f8" letter-spacing="-1">Funshi<tspan fill="#8a93a6" font-weight="500">Engine</tspan></text>

  <text x="80" y="300" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="56" font-weight="600" fill="#f2f4f8" letter-spacing="-1.7">Un motor de juegos en tiempo real</text>
  <text x="80" y="368" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="56" font-weight="600" fill="#f2f4f8" letter-spacing="-1.7">y las herramientas que lo acompañan</text>

  <text x="80" y="440" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" fill="#b6bdcc">Motor y editor en tiempo real con backends intercambiables, terminal JSON,</text>
  <text x="80" y="476" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" fill="#b6bdcc">asistente con RAG y agente de código.</text>

  <g font-family="JetBrains Mono, Consolas, monospace" font-size="19" fill="#8a93a6">
    <text x="80" y="566">C++17</text>
    <text x="160" y="566" fill="#3d4557">·</text>
    <text x="188" y="566">OpenGL 3.3</text>
    <text x="330" y="566" fill="#3d4557">·</text>
    <text x="358" y="566">Vulkan</text>
    <text x="448" y="566" fill="#3d4557">·</text>
    <text x="476" y="566">Kotlin</text>
    <text x="562" y="566" fill="#3d4557">·</text>
    <text x="590" y="566" fill="#f0b862">Apache 2.0</text>
  </g>
</svg>`;

/** Icono para la pantalla de inicio de iOS: 180x180, sin transparence. */
const appleTouchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0b0d12"/>
  ${inicial}
</svg>`;

await mkdir(destino, { recursive: true });

await writeFile(resolve(destino, 'favicon.svg'), favicon, 'utf8');
console.log('favicon.svg: escrito');

const salidas = [
  { nombre: 'og-image.png', svg: ogImage, ancho: 1200, alto: 630 },
  { nombre: 'apple-touch-icon.png', svg: appleTouchIcon, ancho: 180, alto: 180 },
];

for (const salida of salidas) {
  const png = await sharp(Buffer.from(salida.svg), { density: 144 })
    .resize(salida.ancho, salida.alto)
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(resolve(destino, salida.nombre), png);
  console.log(`${salida.nombre}: ${salida.ancho}x${salida.alto} (${(png.length / 1024).toFixed(1)} kB)`);
}
