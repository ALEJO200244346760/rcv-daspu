// ─────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────

export const calcularIMC = (peso, talla) => {
  if (!peso || !talla) return null;
  const tallaM = parseFloat(talla) / 100;
  const imc = parseFloat(peso) / (tallaM * tallaM);
  if (isNaN(imc) || !isFinite(imc)) return null;
  let clasificacion = '';
  if (imc < 18.5) clasificacion = 'Bajo peso';
  else if (imc < 25) clasificacion = 'Normal';
  else if (imc < 30) clasificacion = 'Sobrepeso';
  else clasificacion = 'Obesidad';
  return { valor: imc.toFixed(1), clasificacion };
};

export const obtenerColorRiesgo = (nivel) => {
  if (!nivel) return 'bg-gray-100 text-gray-500';
  if (nivel.includes('Bajo')) return 'bg-green-100 text-green-800';
  if (nivel.includes('Muy Alto')) return 'bg-red-200 text-red-900';
  if (nivel.includes('Alto')) return 'bg-orange-100 text-orange-800';
  if (nivel.includes('Moderado')) return 'bg-yellow-100 text-yellow-800';
  if (nivel.includes('Crítico')) return 'bg-red-300 text-red-900';
  return 'bg-gray-100 text-gray-600';
};

/**
 * Convierte un link de página de ImgBB al link directo de imagen.
 * https://ibb.co/ABC123  →  intenta obtener la imagen directa
 * Si ya es un link directo (i.ibb.co o termina en extensión), lo devuelve igual.
 */
export const normalizarLinkImgBB = (url) => {
  if (!url) return url;
  // Ya es link directo
  if (url.includes('i.ibb.co')) return url;
  // Si termina en extensión de imagen, está bien
  if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url)) return url;
  // Si es página ibb.co/CODIGO, convertimos a i.ibb.co embebiendo el código
  // ImgBB expone la imagen en: https://i.ibb.co/<codigo>/<nombre>
  // Como no podemos saber el nombre, abrimos la página original
  return url;
};