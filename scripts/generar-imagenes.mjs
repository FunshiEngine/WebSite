/**
 * Genera los imagenes estaticos del sitio a partir de su definicion SVG:
 * la imagen para redes sociales y el icono de Apple.
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

/** Imagen para redes sociales: 1200x630. */
const ogImage = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="16%" cy="6%" r="62%">
      <stop offset="0%" stop-color="#e29a3c" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#e29a3c" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b" cx="94%" cy="98%" r="56%">
      <stop offset="0%" stop-color="#64789b" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#64789b" stop-opacity="0"/>
    </radialGradient>
    <pattern id="g" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#07080b"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect width="1200" height="630" fill="url(#g)"/>

  <g transform="translate(80 68)">
    <path d="M26 2.5 46 14v24L26 49.5 6 38V14z" fill="none" stroke="#e29a3c" stroke-width="1.75" stroke-linejoin="round" opacity="0.45"/>
    <path d="M16 40.5 26 21l10 19.5" fill="none" stroke="#f0b862" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.3 34.7h13.4" fill="none" stroke="#f0b862" stroke-width="2.4" stroke-linecap="round"/>
    <text x="72" y="38" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="38" font-weight="600" fill="#f2f4f8" letter-spacing="-1">
      Funshi<tspan fill="#8a93a6" font-weight="500">Engine</tspan>
    </text>
  </g>

  <text x="80" y="256" font-family="JetBrains Mono, Consolas, monospace" font-size="19" letter-spacing="4" fill="#f0b862">ORGANIZACIÓN</text>

  <text x="80" y="326" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="54" font-weight="600" fill="#f2f4f8" letter-spacing="-1.6">Un motor de juegos, su contrato</text>
  <text x="80" y="390" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="54" font-weight="600" fill="#f2f4f8" letter-spacing="-1.6">y las herramientas que lo hacen manejable.</text>

  <text x="80" y="452" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" fill="#b6bdcc">Motor y editor en tiempo real con backends intercambiables, terminal JSON,</text>
  <text x="80" y="486" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" fill="#b6bdcc">asistente con RAG y agente de código.</text>

  <g font-family="JetBrains Mono, Consolas, monospace" font-size="19" fill="#8a93a6">
    <text x="80" y="570">C++17</text>
    <text x="160" y="570" fill="#3d4557">·</text>
    <text x="188" y="570">OpenGL 3.3</text>
    <text x="330" y="570" fill="#3d4557">·</text>
    <text x="358" y="570">Vulkan</text>
    <text x="448" y="570" fill="#3d4557">·</text>
    <text x="476" y="570">Kotlin</text>
    <text x="562" y="570" fill="#3d4557">·</text>
    <text x="590" y="570" fill="#f0b862">Apache 2.0</text>
  </g>
</svg>`;

/** Icono para la pantalla de inicio de iOS: 180x180, sin transparence. */
const appleTouchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <radialGradient id="a" cx="30%" cy="18%" r="72%">
      <stop offset="0%" stop-color="#e29a3c" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#e29a3c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="180" height="180" fill="#0b0d12"/>
  <rect width="180" height="180" fill="url(#a)"/>
  <g transform="translate(34 34) scale(3.5)">
    <path d="M16 2.5 28 9v14L16 29.5 4 23V9z" fill="none" stroke="#e29a3c" stroke-width="1.5" stroke-linejoin="round" opacity="0.5"/>
    <path d="M11 20.5 16 11l5 9.5" fill="none" stroke="#f0b862" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.8 17.4h6.4" fill="none" stroke="#f0b862" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

await mkdir(destino, { recursive: true });

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
