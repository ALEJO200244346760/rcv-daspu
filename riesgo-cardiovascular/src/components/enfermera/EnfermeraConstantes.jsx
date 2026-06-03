// ─────────────────────────────────────────────────────────────
// CONSTANTES DEL FORMULARIO ENFERMERA
// ─────────────────────────────────────────────────────────────

export const MEDS_HIPERTENSION = [
  "Enalapril 10 mg cada 12 Hs","Enalapril 5 mg cada 12 Hs",
  "Losartan 25 mg cada 12 Hs","Losartan 50 mg cada 12 Hs",
  "Amlodipina 10 mg cada 12 Hs","Amlodipina 5 mg cada 12 Hs",
  "Hidroclorotiazida 25 mg cada 12 Hs","Furosemida 20 mg cada 12 Hs",
  "Valsartán 160 mg cada 12 Hs","Valsartán 80 mg cada 12 Hs",
  "Carvedilol 25 mg cada 12 Hs","Carvedilol 12,5 mg cada 12 Hs",
  "Bisoprolol 5 mg cada 12 Hs","Bisoprolol 2,5 mg cada 12 Hs",
  "Nebivolol 10 mg por día","Nebivolol 5 mg por día",
  "Espironolactona 25 mg por día","Otros"
];

export const MEDS_DIABETES = [
  "Metformina 500 mg dos por día","Metformina 850 mg dos por día",
  "Metformina 1000 mg dos por día","Otros"
];

export const MEDS_COLESTEROL = [
  "Atorvastatina 10 mg uno por día","Atorvastatina 20 mg uno por día",
  "Atorvastatina 40 mg uno por día","Atorvastatina 80 mg uno por día",
  "Rosuvastatina 5 mg uno por día","Rosuvastatina 10 mg uno por día",
  "Rosuvastatina 20 mg uno por día","Rosuvastatina 40 mg uno por día","Otros"
];

export const COMPLICACIONES_EMBARAZO = [
  "Hipertensión arterial gestacional","Preeclampsia","Eclampsia",
  "Diabetes gestacional","Parto prematuro antes de las 37 semanas","Ninguno"
];

export const EVENTOS_CV = [
  "Infarto","Trombosis arterial","Accidente cerebrovascular",
  "Stent","Bypass","Valvulopatía","Arritmias","Enfermedad renal crónica",
  "Insuficiencia cardíaca", "Ninguno"
];

export const SINTOMAS = [
  "Dolor en el pecho o falta de aire al hacer esfuerzos",
  "Hinchazón de piernas, manos o cara por la tarde",
  "Diuresis nocturna","Palpitaciones",
  "Mareos / desmayos / pérdidas de conocimiento","Otro","Ninguno"
];

export const ESTADO_INICIAL = {
  dni: '', fechaNacimiento: '', edad: '', telefono: '', genero: '',
  tuvoHijos: '', complicacionesEmbarazo: [],
  eventosCv: {},
  tomaMedicacion: '',
  hipertension: '', medsHipertension: [], otroMedHipertension: '',
  diabetes: '', medsDiabetes: [], otroMedDiabetes: '',
  colesterol: '', medsColesterol: [], otroMedColesterol: '',
  estresAnsiedad: '', estresDetalle: '',
  otrasPatologias: '', otrasPatologiasDetalle: '',
  fuma: '', fumoPorMucho: '',
  consumeAlcohol: '', duerme68: '', actividadFisica: '',
  sintomas: [], sintomaOtro: '',
  peso: '', talla: '', cintura: '', tensionSistolica: '', tensionDiastolica: '',
  linkElectrocardiograma: '', linkEcocardiograma: '', linkLaboratorio: '',
  tieneOtroEstudio: '', linkOtroEstudio: '', nombreOtroEstudio: '',
};
