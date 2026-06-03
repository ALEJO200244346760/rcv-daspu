// ─────────────────────────────────────────────────────────────
// FUNCIÓN COPIAR — datos del FormularioEnfermera
// ─────────────────────────────────────────────────────────────

const val = (v) => (v !== null && v !== undefined && v !== '' ? v : '--');

export const copiarDatosEnfermeria = (est) => {
  // Parsear eventos CV (guardados como JSON string)
  let eventosCv = {};
  try { eventosCv = JSON.parse(est.eventosCv || '{}'); } catch {}
  const eventosActivos = Object.entries(eventosCv)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ') || 'Ninguno';

  const datos = `
REGISTRO DE ENFERMERÍA — CIRCUITO CARDIOVASCULAR DASPU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. DATOS FILIATORIOS ━━━

DNI: ${val(est.dni)}
Fecha de nacimiento: ${val(est.fechaNacimiento)}
Edad: ${val(est.edad)} años
Teléfono: ${val(est.telefono)}
Género: ${val(est.genero)}
${est.genero === 'femenino' ? `
Tuvo hijos: ${val(est.tuvoHijos)}
Complicaciones en embarazo: ${val(est.complicacionesEmbarazo)}
` : ''}

━━━ 2. EVENTOS CARDIOVASCULARES ━━━

${eventosActivos}


━━━ 3. FACTORES DE RIESGO / MEDICACIÓN ━━━

Toma medicación a diario: ${val(est.tomaMedicacion)}

Hipertensión: ${val(est.hipertension)}
${est.hipertension === 'Sí' ? `  Medicamentos: ${val(est.medsHipertension)}${est.otroMedHipertension ? `\n  Otro: ${est.otroMedHipertension}` : ''}` : ''}

Diabetes: ${val(est.diabetes)}
${est.diabetes === 'Sí' ? `  Medicamentos: ${val(est.medsDiabetes)}${est.otroMedDiabetes ? `\n  Otro: ${est.otroMedDiabetes}` : ''}` : ''}

Colesterol elevado: ${val(est.colesterol)}
${est.colesterol === 'Sí' ? `  Medicamentos: ${val(est.medsColesterol)}${est.otroMedColesterol ? `\n  Otro: ${est.otroMedColesterol}` : ''}` : ''}

Estrés / Ansiedad / Depresión: ${val(est.estresAnsiedad)}${est.estresDetalle ? `\n  Detalle: ${est.estresDetalle}` : ''}

Otras patologías: ${val(est.otrasPatologias)}${est.otrasPatologiasDetalle ? `\n  Detalle: ${est.otrasPatologiasDetalle}` : ''}


━━━ 4. HÁBITOS ━━━

Fuma actualmente: ${val(est.fuma)}
Fumó en el pasado: ${val(est.fumoPorMucho)}
Consume alcohol habitualmente: ${val(est.consumeAlcohol)}
Duerme 6-8 horas diarias: ${val(est.duerme68)}
Realiza actividad física (150 min/semana): ${val(est.actividadFisica)}


━━━ 5. SÍNTOMAS DE ALARMA ━━━

${val(est.sintomas)}${est.sintomaOtro ? `\nOtro: ${est.sintomaOtro}` : ''}


━━━ 6. DATOS ANTROPOMÉTRICOS Y CLÍNICOS ━━━

Peso: ${val(est.peso)} kg
Talla: ${val(est.talla)} cm
Cintura: ${val(est.cintura)} cm
TA Máxima: ${val(est.tensionSistolica)} mmHg
TA Mínima: ${val(est.tensionDiastolica)} mmHg
IMC: ${val(est.imc)}${est.imcClasificacion ? ` (${est.imcClasificacion})` : ''}
Nivel de Riesgo Cardiovascular: ${val(est.nivelRiesgo)}


━━━ 7. ESTUDIOS COMPLEMENTARIOS ━━━

Electrocardiograma: ${val(est.linkElectrocardiograma)}
Ecocardiograma: ${val(est.linkEcocardiograma)}
Laboratorio: ${val(est.linkLaboratorio)}
${est.linkOtroEstudio ? `${val(est.nombreOtroEstudio) || 'Otro estudio'}: ${val(est.linkOtroEstudio)}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fecha de carga: ${est.fechaCarga ? new Date(est.fechaCarga).toLocaleDateString('es-AR') : '--'}
`.trim();

  navigator.clipboard.writeText(datos)
    .then(() => alert('✅ Datos de enfermería copiados al portapapeles.'))
    .catch(() => alert('❌ No se pudo copiar. Intentá de nuevo.'));
};