import { Advertencia } from '../ConstFormulario';

export const apiBaseURL = 'https://rcv-daspu-production.up.railway.app';

export const obtenerColorRiesgo = (nivel) => {
  switch (nivel) {
    case 'Poco':       return 'bg-green-100 text-green-800';
    case 'Moderado':   return 'bg-yellow-100 text-yellow-800';
    case 'Alto':       return 'bg-orange-100 text-orange-800';
    case 'Muy Alto':   return 'bg-red-100 text-red-800';
    case 'Crítico':    return 'bg-red-900 text-white';
    default:           return '';
  }
};

export const obtenerNivelColesterol = (valor) => {
  if (valor < 154)              return 4;
  if (valor >= 155 && valor <= 192) return 5;
  if (valor >= 193 && valor <= 231) return 6;
  if (valor >= 232 && valor <= 269) return 7;
  return 8;
};

export const aplicarFiltros = (pacientes, filtros, nivelColesterolConocido, busquedaCuil) => {
  return pacientes.filter(p => {
    const edadFiltro             = filtros.edad         === '' ? null : filtros.edad;
    const cinturaFiltro          = filtros.cintura       === '' ? null : filtros.cintura;
    const presionFiltro          = filtros.presionArterial === '' ? null : filtros.presionArterial;
    const nivelColFiltro         = filtros.nivelColesterol === '' ? null : Number(filtros.nivelColesterol);
    const nivelColPaciente       = p.colesterol ? obtenerNivelColesterol(Number(p.colesterol)) : null;

    const coincideCuil = busquedaCuil.trim() === '' || String(p.cuil || '').includes(busquedaCuil.trim());

    const imc = p.imc;
    const catIMC = imc < 18.5 ? '<18.5'
      : imc <= 24.9 ? '18.5-24.9'
      : imc <= 29.9 ? '25-29.9'
      : imc <= 34.9 ? '30-34.9'
      : imc <= 39.9 ? '35-39.9' : '40+';

    let edadValida = true;
    if (edadFiltro) {
      const [min, max] = edadFiltro.split('-').map(Number);
      edadValida = isNaN(max) ? p.edad > 71 : p.edad >= min && p.edad <= (max || Infinity);
    }

    let cinturaValida = true;
    if (cinturaFiltro) {
      if (cinturaFiltro === '<88')   cinturaValida = p.cintura < 88;
      else if (cinturaFiltro === '88+')  cinturaValida = p.cintura > 88;
      else if (cinturaFiltro === '<102') cinturaValida = p.cintura < 102;
      else if (cinturaFiltro === '102+') cinturaValida = p.cintura > 102;
    }

    const eq = (a, b) => !b || (a && a.toLowerCase() === b.toLowerCase());
    const inc = (a, b) => !b || (a && a.toLowerCase().includes(b.toLowerCase()));

    return (
      edadValida && cinturaValida && coincideCuil &&
      eq(p.genero, filtros.genero) &&
      eq(p.doctor, filtros.doctor) &&
      eq(p.diabetes, filtros.diabetes) &&
      eq(p.fumador, filtros.fumador) &&
      eq(p.exfumador, filtros.exfumador) &&
      (!presionFiltro || String(p.presionArterial) === presionFiltro) &&
      (
        nivelColesterolConocido === 'todos' ||
        (nivelColesterolConocido === 'no' && (!p.colesterol || p.colesterol === 'No')) ||
        (nivelColesterolConocido === 'si' && p.colesterol && p.colesterol !== 'No' &&
          (!nivelColFiltro || nivelColPaciente === nivelColFiltro))
      ) &&
      eq(p.nivelRiesgo, filtros.nivelRiesgo) &&
      eq(p.ubicacion, filtros.ubicacion) &&
      (!filtros.imc || filtros.imc === catIMC) &&
      eq(p.infarto, filtros.infarto) &&
      eq(p.acv, filtros.acv) &&
      eq(p.hipertenso, filtros.hipertenso) &&
      inc(p.medicamentosHipertension, filtros.medicamentosHipertension) &&
      inc(p.medicamentosDiabetes, filtros.medicamentosDiabetes) &&
      inc(p.medicamentosColesterol, filtros.medicamentosColesterol) &&
      eq(p.aspirina, filtros.aspirina) &&
      (!filtros.tfg || p.tfg === Number(filtros.tfg)) &&
      (!filtros.numeroGestas || p.numeroGestas === Number(filtros.numeroGestas)) &&
      eq(p.fum, filtros.fum) &&
      inc(p.metodoAnticonceptivo, filtros.metodoAnticonceptivo) &&
      eq(p.trastornosHipertensivos, filtros.trastornosHipertensivos) &&
      eq(p.diabetesGestacional, filtros.diabetesGestacional) &&
      eq(p.sop, filtros.sop) &&
      inc(p.enfermedad, filtros.enfermedad) &&
      eq(p.alergias, filtros.alergias) &&
      eq(p.tiroides, filtros.tiroides) &&
      eq(p.sedentarismo, filtros.sedentarismo)
    );
  });
};

// ─────────────────────────────────────────────────────────────
// COPIAR DATOS — Formulario + Circuito + Enfermería
// ─────────────────────────────────────────────────────────────
export const copiarDatos = async (paciente, datosCircuitoTotales, datosEnfermeriaTotales) => {
  // Datos del circuito
  const datosCircuito = datosCircuitoTotales.find(p => p.patientInfo?.dni === paciente.cuil) || {};
  const c  = datosCircuito;
  const lb = c.laboratorio || {};
  const or = c.orina || {};
  const ap = c.antecedentesPersonales || {};
  const af = c.antecedentesFamiliares || {};

  // Datos de enfermería (tabla estudios, buscamos por DNI el más reciente)
  const enf = (datosEnfermeriaTotales || []).find(e => e.dni === paciente.cuil) || {};

  // Parsear eventos CV de enfermería (guardado como JSON string)
  let eventosCvObj = {};
  try { eventosCvObj = JSON.parse(enf.eventosCv || '{}'); } catch {}
  const eventosActivos = Object.entries(eventosCvObj).filter(([, v]) => v).map(([k]) => k).join(', ') || '--';

  const nivelRiesgoTexto = paciente.nivelRiesgo;
  const recomendaciones  = Advertencia[nivelRiesgoTexto] || 'No hay recomendaciones disponibles.';

  const v = (val, unit = '') => (val !== null && val !== undefined && val !== '' && val !== 'N/A') ? `${val}${unit ? ' ' + unit : ''}` : '--';

  const datos = `
CIRCUITO CARDIOVASCULAR DASPU MAS VOS
ID: ${v(paciente.id)} | FECHA: ${v(paciente.fechaRegistro)} | DNI: ${v(paciente.cuil)} | TELÉFONO: ${v(paciente.telefono)} | EDAD: ${v(paciente.edad)} | GÉNERO: ${v(paciente.genero)}


═══════════════════════════════════════
DATOS CARGADOS POR ENFERMERÍA
═══════════════════════════════════════

Fecha de nacimiento: ${v(enf.fechaNacimiento)}
Teléfono (enf.): ${v(enf.telefono)}
Género (enf.): ${v(enf.genero)}
${enf.genero === 'femenino' ? `Tuvo hijos: ${v(enf.tuvoHijos)}
Complicaciones embarazo: ${v(enf.complicacionesEmbarazo)}` : ''}

EVENTOS CARDIOVASCULARES:
${eventosActivos}

FACTORES DE RIESGO (ENFERMERÍA):
Toma medicación: ${v(enf.tomaMedicacion)}
Hipertensión: ${v(enf.hipertension)} | Meds.: ${v(enf.medsHipertension)}${enf.otroMedHipertension ? ` / ${enf.otroMedHipertension}` : ''}
Diabetes: ${v(enf.diabetes)} | Meds.: ${v(enf.medsDiabetes)}${enf.otroMedDiabetes ? ` / ${enf.otroMedDiabetes}` : ''}
Colesterol elevado: ${v(enf.colesterol)} | Meds.: ${v(enf.medsColesterol)}${enf.otroMedColesterol ? ` / ${enf.otroMedColesterol}` : ''}
Estrés/Ansiedad: ${v(enf.estresAnsiedad)}${enf.estresDetalle ? ` — ${enf.estresDetalle}` : ''}
Otras patologías: ${v(enf.otrasPatologias)}${enf.otrasPatologiasDetalle ? ` — ${enf.otrasPatologiasDetalle}` : ''}

HÁBITOS (ENFERMERÍA):
Fuma: ${v(enf.fuma)} | Fumó antes: ${v(enf.fumoPorMucho)}
Alcohol habitual: ${v(enf.consumeAlcohol)}
Duerme 6-8 hs: ${v(enf.duerme68)}
Actividad física 150 min/sem: ${v(enf.actividadFisica)}

SÍNTOMAS DE ALARMA (ENFERMERÍA):
${v(enf.sintomas)}${enf.sintomaOtro ? ` — ${enf.sintomaOtro}` : ''}

DATOS ANTROPOMÉTRICOS (ENFERMERÍA):
Peso: ${v(enf.peso, 'kg')} | Talla: ${v(enf.talla, 'cm')} | Cintura: ${v(enf.cintura, 'cm')}
TA Máx.: ${v(enf.tensionSistolica, 'mmHg')} | TA Mín.: ${v(enf.tensionDiastolica, 'mmHg')}
IMC: ${v(enf.imc)} (${v(enf.imcClasificacion)})
Riesgo CV (enfermería): ${v(enf.nivelRiesgo)}

ESTUDIOS COMPLEMENTARIOS (ENFERMERÍA):
ECG: ${v(enf.linkElectrocardiograma)}
Ecocardiograma: ${v(enf.linkEcocardiograma)}
Laboratorio: ${v(enf.linkLaboratorio)}
${enf.linkOtroEstudio ? `${enf.nombreOtroEstudio || 'Otro'}: ${enf.linkOtroEstudio}` : ''}


═══════════════════════════════════════
DATOS DEL FORMULARIO MÉDICO
═══════════════════════════════════════

FACTORES DE RIESGO CARDIOVASCULARES

HIPERTENSIÓN: ${v(paciente.hipertenso)}
Medicamentos Hipertensión: ${v(paciente.medicamentosHipertension)}
DIABETES: ${v(paciente.diabetes)}
Medicamentos Diabetes: ${v(paciente.medicamentosDiabetes)}
Fumador: ${v(paciente.fumador)}
ExFumador: ${v(paciente.exfumador)}
SEDENTARISMO: ${v(paciente.sedentarismo)}
SUEÑO: ${v(paciente.sueño)}


ENFERMEDAD CARDIOVASCULAR ESTABLECIDA

CARDIOPATIA ISQUEMICA -
INSUFICIENCIA CARDIACA -
ARRITMIAS -
VALVULOPATIAS -
ENFERMEDAD VASCULAR PERIFERICA -
ACV -


OTROS ANTECEDENTES PATOLÓGICOS

RENAL: ${v(paciente.renal)}
PULMONAR: ${v(paciente.pulmonar)}
ALERGIAS: ${v(paciente.alergias)}
TIROIDES: ${v(paciente.tiroides)}
EPOC: ${ap.epoc ? 'SÍ' : 'NO'} | ICC: ${ap.icc ? 'SÍ' : 'NO'} | ASMA: ${ap.asma ? 'SÍ' : 'NO'}
ARTRITIS: ${ap.artritis ? 'SÍ' : 'NO'} | ANGINA: ${ap.anginaPecho ? 'SÍ' : 'NO'} | ICTUS: ${ap.ictus ? 'SÍ' : 'NO'}
MAMOGRAFÍA: ${v(ap.mamografiaFecha)} | PAP/SOMF: ${v(ap.papSomfFecha)} | ALBUMINURIA: ${v(ap.albuminuria)}

ANTECEDENTES FAMILIARES:
AF Diabetes: ${af.afDiabetes ? 'SÍ' : 'NO'} | AF HTA: ${af.afHipertension ? 'SÍ' : 'NO'}
AF Cardiopatía: ${af.afCardiopatia ? 'SÍ' : 'NO'} | AF ACV: ${af.afAcv ? 'SÍ' : 'NO'}
CÓDIGOS: ${v(af.afCodigos)} | FAT/RES/DEA: ${v(af.fatResDeaPdp)}

MEDICACIÓN COLESTEROL: ${v(paciente.medicamentosColesterol)}

SIGNOS VITALES Y MEDIDAS ANTROPOMÉTRICAS

TA Máx.: ${v(paciente.presionArterial)} | TA Mín.: ${v(paciente.taMin)}
Colesterol: ${v(paciente.colesterol)}
IMC: ${v(paciente.imc)} | PESO: ${v(paciente.peso)} | TALLA: ${v(paciente.talla)} | CINTURA: ${v(paciente.cintura)}

ELECTROCARDIOGRAMA:
Ritmo sinusal, frecuencia cardíaca y eje normal, sin trastornos agudos del segmento ST y T, sin alteraciones en el sistema de conducción, sin arritmias, intervalo QT dentro de lo normal.

NIVEL DE RIESGO CARDIOVASCULAR (OMS): ${v(nivelRiesgoTexto)}


═══════════════════════════════════════
LABORATORIO — HEMOGRAMA
═══════════════════════════════════════

ERITROCITOS: ${v(lb.eritrocitos)} | HEMOGLOBINA: ${v(lb.hemoglobina)} | HEMATOCRITO: ${v(lb.hematocrito)}
VCM: ${v(lb.vcm)} | HCM: ${v(lb.hcm)} | CHCM: ${v(lb.chcm)} | RDW: ${v(lb.rdw)}
LEUCOCITOS: ${v(lb.leucocitos)} | NEUTRÓFILOS SEGM: ${v(lb.neutrofilosSegm)}%
EOSINÓFILOS: ${v(lb.eosinofilos)}% | BASÓFILOS: ${v(lb.basofilos)}% | LINFOCITOS: ${v(lb.linfocitos)}% | MONOCITOS: ${v(lb.monocitos)}%
NEUTRÓFILOS ABS: ${v(lb.neutrofilosAbsoluto)} | LINFOCITOS ABS: ${v(lb.linfocitosAbsoluto)}

QUÍMICA Y ELECTROLITOS:
CREATININA: ${v(lb.creatinina)} | TFG: ${v(lb.filtradoGlomerular)}
SODIO: ${v(lb.sodio)} | POTASIO: ${v(lb.potasio)} | CLORO: ${v(lb.cloro)}
HDL: ${v(lb.hdl)} | LDL: ${v(lb.ldl)} | TRIGLICÉRIDOS: ${v(lb.trigliceridos)}
GLUCEMIA: ${v(lb.glucemia)} mg/dL

EXAMEN DE ORINA:
COLOR: ${v(or.color)} | ASPECTO: ${v(or.aspecto)} | PH: ${v(or.ph)} | DENSIDAD: ${v(or.densidad)}
PROTEINURIA: ${v(or.proteinuria)} | CREATININURIA: ${v(or.creatininuira)} | REL. PROT/CREA: ${v(or.relacionProteinaCreatinina)}
GLUCOSA: ${v(or.glucosa)} | CETONAS: ${v(or.cetonas)} | NITRITOS: ${v(or.nitritos)}
LEUCOCITOS ORINA: ${v(or.leucocitosOrina)} | HEMATÍES ORINA: ${v(or.hematiesOrina)}

SÍNTOMAS
No refiere angor, disnea, palpitaciones, mareos ni edemas.

═══════════════════════════════════════
RE-ESTRATIFICACIÓN DEL RIESGO CARDIOVASCULAR
═══════════════════════════════════════

--- CONDUCTA CLÍNICA ---
--- SOLICITUD DE ESTUDIOS SUGERIDOS ---
--- INTERCONSULTAS SUGERIDAS ---

${paciente.sintomaAlarma    ? `SÍNTOMAS DE ALARMA: ${paciente.sintomaAlarma}`          : ''}
${paciente.interconsulta    ? `INTERCONSULTA: ${paciente.interconsulta}`                : ''}
${paciente.solicitarEstudios? `SOLICITUD DE ESTUDIOS: ${paciente.solicitarEstudios}`    : ''}
${paciente.cambioMedicacion ? `CAMBIO DE MEDICACIÓN: ${paciente.cambioMedicacion}`      : ''}

RECOMENDACIONES:
${recomendaciones}

--- OTROS ---
${paciente.consulta              ? `CONSULTA: ${paciente.consulta}`                             : ''}
${paciente.practica              ? `PRÁCTICA: ${paciente.practica}`                             : ''}
${paciente.hipertensionArterial  ? `HIPERTENSIÓN ARTERIAL: ${paciente.hipertensionArterial}`    : ''}
${paciente.medicacionPrescripcion? `MEDICACIÓN PRESCRIPCIÓN: ${paciente.medicacionPrescripcion}`: ''}
${paciente.medicacionDispensa    ? `MEDICACIÓN DISPENSA: ${paciente.medicacionDispensa}`        : ''}
${paciente.tabaquismo            ? `TABAQUISMO: ${paciente.tabaquismo}`                         : ''}
${paciente.laboratorio           ? `LABORATORIO: ${paciente.laboratorio}`                       : ''}
`;

  try {
    await navigator.clipboard.writeText(datos.trim());
    alert('Datos copiados correctamente (Formulario + Circuito + Enfermería).');
  } catch (err) {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar. Revisá los permisos del navegador.');
  }
};