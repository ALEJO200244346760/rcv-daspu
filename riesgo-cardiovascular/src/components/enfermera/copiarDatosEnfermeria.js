import { Advertencia } from '../ConstFormulario';

const val = (v) => (v !== null && v !== undefined && v !== '' ? v : '--');

export const copiarDatosEnfermeria = (est) => {
  // Parsear eventos CV
  let eventosCv = {};
  try { eventosCv = JSON.parse(est.eventosCv || '{}'); } catch {}
  const eventosActivos = Object.entries(eventosCv)
    .filter(([, v]) => v).map(([k]) => k).join(', ') || 'Ninguno';

  // IMC elevado
  const imcNum = parseFloat(est.imc);
  const imcElevado = !isNaN(imcNum) && imcNum >= 25;
  const imcTexto = est.imcClasificacion || (
    imcNum < 18.5 ? 'Bajo peso' : imcNum < 25 ? 'Normal' : imcNum < 30 ? 'Sobrepeso' : 'Obesidad'
  );

  // Cintura aumentada
  const cinturaNum = parseFloat(est.cintura);
  const esHombre = est.genero === 'masculino';
  const cinturaAumentada = !isNaN(cinturaNum) && (esHombre ? cinturaNum > 102 : cinturaNum > 88);

  // Medicación detallada
  const detalleMedicacion = () => {
    if (est.tomaMedicacion !== 'Sí') return `Toma medicación a diario: ${val(est.tomaMedicacion)}`;
    const lineas = ['Toma medicación a diario: Sí'];
    if (est.hipertension === 'Sí') {
      lineas.push('  Hipertensión: Sí');
      if (est.medsHipertension) lineas.push(`    Medicamentos: ${est.medsHipertension}`);
      if (est.otroMedHipertension) lineas.push(`    Otro: ${est.otroMedHipertension}`);
    } else if (est.hipertension) lineas.push(`  Hipertensión: ${est.hipertension}`);

    if (est.diabetes === 'Sí') {
      lineas.push('  Diabetes: Sí');
      if (est.medsDiabetes) lineas.push(`    Medicamentos: ${est.medsDiabetes}`);
      if (est.otroMedDiabetes) lineas.push(`    Otro: ${est.otroMedDiabetes}`);
    } else if (est.diabetes) lineas.push(`  Diabetes: ${est.diabetes}`);

    if (est.colesterol === 'Sí') {
      lineas.push('  Colesterol elevado: Sí');
      if (est.medsColesterol) lineas.push(`    Medicamentos: ${est.medsColesterol}`);
      if (est.otroMedColesterol) lineas.push(`    Otro: ${est.otroMedColesterol}`);
    } else if (est.colesterol) lineas.push(`  Colesterol elevado: ${est.colesterol}`);

    if (est.estresAnsiedad) lineas.push(`  Estrés/Ansiedad/Depresión: ${est.estresAnsiedad}${est.estresDetalle ? ` — ${est.estresDetalle}` : ''}`);
    if (est.otrasPatologias) lineas.push(`  Otras patologías: ${est.otrasPatologias}${est.otrasPatologiasDetalle ? ` — ${est.otrasPatologiasDetalle}` : ''}`);
    return lineas.join('\n');
  };

  const recomendaciones = Advertencia[est.nivelRiesgo] || 'No hay recomendaciones disponibles.';
  const fechaCarga = est.fechaCarga ? new Date(est.fechaCarga).toLocaleDateString('es-AR') : '--';

  const datos = `
CIRCUITO CARDIOVASCULAR DASPU MAS VOS
Fecha: ${fechaCarga}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━ 1. DATOS FILIATORIOS ━━━

DNI: ${val(est.dni)}
Fecha de nacimiento: ${val(est.fechaNacimiento)}
Edad: ${val(est.edad)} años
Teléfono: ${val(est.telefono)}
Género: ${val(est.genero)}


━━━ 2. EVENTOS CARDIOVASCULARES ━━━

${eventosActivos}


━━━ 3. FACTORES DE RIESGO / MEDICACIÓN ━━━

${detalleMedicacion()}
${cinturaAumentada ? `\nCINTURA AUMENTADA: ${val(est.cintura)} cm ${esHombre ? '(>102 cm en hombre)' : '(>88 cm en mujer)'}` : ''}
${imcElevado ? `\nIMC ELEVADO: ${val(est.imc)} — ${imcTexto}` : ''}
${est.genero === 'femenino' ? `\nTuvo hijos: ${val(est.tuvoHijos)}${est.complicacionesEmbarazo ? `\nComplicaciones en embarazo: ${est.complicacionesEmbarazo}` : ''}` : ''}


━━━ 4. HÁBITOS ━━━

Fuma actualmente: ${val(est.fuma)}
Fumó en el pasado: ${val(est.fumoPorMucho)}
Consume alcohol habitualmente: ${val(est.consumeAlcohol)}
Duerme 6-8 horas diarias: ${val(est.duerme68)}
Realiza actividad física (150 min/semana): ${val(est.actividadFisica)}


━━━ 5. SÍNTOMAS DE ALARMA ━━━

${val(est.sintomas)}${est.sintomaOtro ? `\nOtro: ${est.sintomaOtro}` : ''}


━━━ 6. DATOS ANTROPOMÉTRICOS ━━━

Peso: ${val(est.peso)} kg
Talla: ${val(est.talla)} cm
Cintura: ${val(est.cintura)} cm${cinturaAumentada ? ' ⚠️ Aumentada' : ''}
TA Máxima: ${val(est.tensionSistolica)} mmHg
TA Mínima: ${val(est.tensionDiastolica)} mmHg
IMC: ${val(est.imc)}${est.imcClasificacion ? ` (${est.imcClasificacion})` : ''}


━━━ 7. ESTUDIOS COMPLEMENTARIOS ━━━

Electrocardiograma: ${val(est.linkElectrocardiograma)}
ELECTROCARDIOGRAMA:
Ritmo sinusal, frecuencia cardíaca y eje normal, sin trastornos agudos del segmento ST y T, sin alteraciones en el sistema de conducción, sin arritmias, intervalo QT dentro de lo normal.

Ecocardiograma: ${val(est.linkEcocardiograma)}
Laboratorio: ${val(est.linkLaboratorio)}
${est.linkOtroEstudio ? `${val(est.nombreOtroEstudio) || 'Otro estudio'}: ${val(est.linkOtroEstudio)}` : ''}


━━━ NIVEL DE RIESGO CARDIOVASCULAR (OMS) ━━━

${val(est.nivelRiesgo)}


━━━ RECOMENDACIONES ━━━

${recomendaciones}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  navigator.clipboard.writeText(datos)
    .then(() => alert('✅ Datos de enfermería copiados al portapapeles.'))
    .catch(() => alert('❌ No se pudo copiar. Intentá de nuevo.'));
};