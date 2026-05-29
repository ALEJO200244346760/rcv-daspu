import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { calcularRiesgoCardiovascular } from './Calculadora';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────
const MEDS_HIPERTENSION = [
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
const MEDS_DIABETES = [
  "Metformina 500 mg dos por día","Metformina 850 mg dos por día",
  "Metformina 1000 mg dos por día","Otros"
];
const MEDS_COLESTEROL = [
  "Atorvastatina 10 mg uno por día","Atorvastatina 20 mg uno por día",
  "Atorvastatina 40 mg uno por día","Atorvastatina 80 mg uno por día",
  "Rosuvastatina 5 mg uno por día","Rosuvastatina 10 mg uno por día",
  "Rosuvastatina 20 mg uno por día","Rosuvastatina 40 mg uno por día","Otros"
];
const COMPLICACIONES_EMBARAZO = [
  "Hipertensión arterial gestacional","Preeclampsia","Eclampsia",
  "Diabetes gestacional","Parto prematuro antes de las 37 semanas","Ninguno"
];
const EVENTOS_CV = [
  "Infarto","Trombosis arterial","Accidente cerebrovascular",
  "Stent","Bypass","Valvulopatía","Arritmias","Enfermedad renal crónica"
];
const SINTOMAS = [
  "Dolor en el pecho o falta de aire al hacer esfuerzos",
  "Hinchazón de piernas, manos o cara por la tarde",
  "Diuresis nocturna","Palpitaciones",
  "Mareos / desmayos / pérdidas de conocimiento","Otro"
];

// ─────────────────────────────────────────────────────────────
// HELPERS UI
// ─────────────────────────────────────────────────────────────
const SiNo = ({ label, value, onChange, name }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="flex gap-2">
      {['Sí','No'].map(op => (
        <button key={op} type="button"
          onClick={() => onChange(name, op)}
          className={`px-4 py-2 rounded-lg border font-semibold text-sm transition-all ${
            value === op
              ? 'bg-indigo-600 text-white border-indigo-600 shadow'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >{op}</button>
      ))}
    </div>
  </div>
);

const CheckList = ({ items, selected, onChange, color = 'indigo' }) => (
  <div className="flex flex-wrap gap-2">
    {items.map(item => {
      const active = selected.includes(item);
      const colorMap = {
        indigo: active ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        red:    active ? 'bg-red-500 text-white border-red-500'       : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        pink:   active ? 'bg-pink-500 text-white border-pink-500'     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
      };
      return (
        <button key={item} type="button" onClick={() => onChange(item)}
          className={`px-3 py-2 text-sm rounded-lg border transition-all ${colorMap[color] || colorMap.indigo}`}
        >{item}</button>
      );
    })}
  </div>
);

const CheckboxList = ({ items, selected, onChange }) => (
  <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
    {items.map((item, i) => (
      <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
        <input type="checkbox" checked={selected.includes(item)} onChange={() => onChange(item)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
        <span className="text-sm text-gray-700">{item}</span>
      </label>
    ))}
  </div>
);

const SeccionHeader = ({ num, titulo, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-600 text-indigo-800 border-indigo-200',
    red:    'bg-red-500 text-red-800 border-red-200',
    orange: 'bg-orange-500 text-orange-800 border-orange-200',
    green:  'bg-green-600 text-green-800 border-green-200',
    pink:   'bg-pink-500 text-pink-800 border-pink-200',
  };
  const c = colors[color] || colors.indigo;
  const [bg, text, border] = c.split(' ');
  return (
    <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${border}`}>
      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${bg} text-white text-sm font-bold shrink-0`}>{num}</span>
      <h2 className={`text-lg font-bold ${text}`}>{titulo}</h2>
    </div>
  );
};

const calcularIMC = (peso, talla) => {
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

const obtenerColorRiesgo = (nivel) => {
  if (!nivel) return 'bg-gray-100 text-gray-500';
  if (nivel.includes('Bajo')) return 'bg-green-100 text-green-800';
  if (nivel.includes('Muy Alto')) return 'bg-red-200 text-red-900';
  if (nivel.includes('Alto')) return 'bg-orange-100 text-orange-800';
  if (nivel.includes('Moderado')) return 'bg-yellow-100 text-yellow-800';
  if (nivel.includes('Crítico')) return 'bg-red-300 text-red-900';
  return 'bg-gray-100 text-gray-600';
};

const estadoInicial = {
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
  tuvoCvAntes: '', enfermedadRenal: '', consumeAlcohol: '',
  duerme68: '', actividadFisica: '',
  sintomas: [], sintomaOtro: '',
  peso: '', talla: '', cintura: '', tensionSistolica: '', tensionDiastolica: '',
  linkElectrocardiograma: '', linkEcocardiograma: '', linkLaboratorio: '',
  tieneOtroEstudio: '', linkOtroEstudio: '', nombreOtroEstudio: '',
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
const FormularioEnfermera = () => {
  const [form, setForm] = useState(estadoInicial);
  const [nivelRiesgo, setNivelRiesgo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [errorGuardado, setErrorGuardado] = useState('');

  const [estudios, setEstudios] = useState([]);
  const [cargandoEstudios, setCargandoEstudios] = useState(false);
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [estudiosEdit, setEstudiosEdit] = useState(null);
  const [guardandoEdit, setGuardandoEdit] = useState(false);

  const set = (name, value) => setForm(prev => ({ ...prev, [name]: value }));
  const handle = (e) => set(e.target.name, e.target.value);
  const setSiNo = (name, value) => set(name, value);

  const toggleArray = (key, item) => {
    setForm(prev => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] };
    });
  };

  const toggleEvento = (key) => {
    setForm(prev => ({
      ...prev,
      eventosCv: { ...prev.eventosCv, [key]: !prev.eventosCv[key] }
    }));
  };

  // Edad automática
  useEffect(() => {
    if (!form.fechaNacimiento) { set('edad', ''); return; }
    const hoy = new Date();
    const nac = new Date(form.fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() ||
       (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) edad--;
    set('edad', edad >= 0 ? String(edad) : '');
  }, [form.fechaNacimiento]);

  // Cálculo de riesgo automático
  useEffect(() => {
    const { edad, genero, diabetes, fuma, tensionSistolica, eventosCv, enfermedadRenal } = form;
    if (!edad || !genero || !tensionSistolica) { setNivelRiesgo(''); return; }

    const tieneEventoGrave =
      eventosCv['Infarto'] || eventosCv['Accidente cerebrovascular'] ||
      eventosCv['Trombosis arterial'] || enfermedadRenal === 'Sí' || diabetes === 'Sí';

    if (tieneEventoGrave) { setNivelRiesgo('>20% <30% Alto'); return; }

    const ajustarEdad = (e) => e < 50 ? 40 : e <= 59 ? 50 : e <= 69 ? 60 : 70;
    const ajustarPresion = (p) => p < 140 ? 120 : p <= 159 ? 140 : p <= 179 ? 160 : 180;

    try {
      const r = calcularRiesgoCardiovascular(
        ajustarEdad(parseInt(edad)),
        genero,
        diabetes === 'Sí' ? 'Sí' : 'No',
        fuma === 'Sí' ? 'sí' : 'no',
        ajustarPresion(parseInt(tensionSistolica)),
        null
      );
      setNivelRiesgo(r);
    } catch { setNivelRiesgo(''); }
  }, [form.edad, form.genero, form.diabetes, form.fuma, form.tensionSistolica, form.eventosCv, form.enfermedadRenal]);

  const imc = calcularIMC(form.peso, form.talla);

  const guardar = async () => {
    if (!form.dni || form.dni.length < 7) {
      setErrorGuardado('El DNI debe tener al menos 7 dígitos.'); return;
    }
    setGuardando(true); setErrorGuardado(''); setMensajeGuardado('');
    try {
      const payload = {
        ...form,
        eventosCv: JSON.stringify(form.eventosCv),
        complicacionesEmbarazo: form.complicacionesEmbarazo.join('; '),
        medsHipertension: form.medsHipertension.join('; '),
        medsDiabetes: form.medsDiabetes.join('; '),
        medsColesterol: form.medsColesterol.join('; '),
        sintomas: form.sintomas.join('; '),
        nivelRiesgo,
        imc: imc?.valor || '',
        imcClasificacion: imc?.clasificacion || '',
      };
      await axiosInstance.post('/api/estudios', payload);
      setMensajeGuardado('¡Guardado con éxito!');
      setForm(estadoInicial);
      setNivelRiesgo('');
    } catch (e) {
      console.error(e);
      setErrorGuardado('Error al guardar. Revisá los datos.');
    } finally { setGuardando(false); }
  };

  const buscarEstudios = async () => {
    setErrorBusqueda(''); setEstudios([]);
    if (!dniBusqueda || dniBusqueda.length < 7) { setErrorBusqueda('Ingresá un DNI válido.'); return; }
    setCargandoEstudios(true);
    try {
      const { data } = await axiosInstance.get(`/api/estudios/todos/${dniBusqueda}`);
      setEstudios(Array.isArray(data) ? data : [data]);
    } catch (e) {
      setErrorBusqueda(e.response?.status === 404
        ? 'No se encontraron estudios para ese DNI.'
        : 'Error al buscar.');
    } finally { setCargandoEstudios(false); }
  };

  const eliminarEstudio = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este estudio?')) return;
    try {
      await axiosInstance.delete(`/api/estudios/${id}`);
      setEstudios(prev => prev.filter(e => e.id !== id));
    } catch { alert('Error al eliminar.'); }
  };

  const guardarEdicion = async () => {
    setGuardandoEdit(true);
    try {
      await axiosInstance.put(`/api/estudios/${estudiosEdit.id}`, estudiosEdit);
      setEstudios(prev => prev.map(e => e.id === estudiosEdit.id ? estudiosEdit : e));
      setEstudiosEdit(null);
    } catch { alert('Error al guardar cambios.'); }
    finally { setGuardandoEdit(false); }
  };

  const abrirLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  // ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center p-4 md:p-8 max-w-3xl mx-auto space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-gray-900 w-full">Panel de Enfermería</h1>

      {/* ══ SECCIÓN 1 — DATOS FILIATORIOS ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <SeccionHeader num="1" titulo="Datos Filiatorios" color="indigo" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">DNI *</label>
            <input name="dni" value={form.dni} onChange={handle} placeholder="Ej: 30123456"
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handle}
              max={new Date().toISOString().split('T')[0]}
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Edad (calculada automáticamente)</label>
            <input value={form.edad ? `${form.edad} años` : ''} readOnly placeholder="—"
              className="p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handle} placeholder="Ej: 3515001234"
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Género</span>
          <div className="flex gap-2">
            {['masculino','femenino'].map(g => (
              <button key={g} type="button" onClick={() => set('genero', g)}
                className={`px-5 py-2 rounded-lg border font-semibold text-sm transition-all ${
                  form.genero === g
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >{g.charAt(0).toUpperCase() + g.slice(1)}</button>
            ))}
          </div>
        </div>

        {form.genero === 'femenino' && (
          <div className="p-4 border-l-4 border-pink-400 bg-pink-50 rounded-r-lg space-y-4">
            <h3 className="text-base font-bold text-pink-800">Historial Ginecológico</h3>
            <SiNo label="¿Tuvo hijos?" name="tuvoHijos" value={form.tuvoHijos} onChange={setSiNo} />
            {form.tuvoHijos === 'Sí' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Complicaciones en algún embarazo:</p>
                <CheckList items={COMPLICACIONES_EMBARAZO} selected={form.complicacionesEmbarazo}
                  onChange={(item) => toggleArray('complicacionesEmbarazo', item)} color="pink" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ SECCIÓN 2 — EVENTO CARDIOVASCULAR ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <SeccionHeader num="2" titulo="Evento Cardiovascular" color="red" />
        <p className="text-sm text-gray-500">Tildá las enfermedades que haya tenido el paciente:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EVENTOS_CV.map(ev => (
            <label key={ev} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition-all">
              <input type="checkbox" checked={!!form.eventosCv[ev]} onChange={() => toggleEvento(ev)}
                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400" />
              <span className="text-sm font-medium text-gray-700">{ev}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ══ SECCIÓN 3 — FACTORES DE RIESGO ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <SeccionHeader num="3" titulo="Factores de Riesgo Cardiovascular" color="orange" />

        <SiNo label="¿Toma medicación a diario?" name="tomaMedicacion" value={form.tomaMedicacion} onChange={setSiNo} />

        {form.tomaMedicacion === 'Sí' && (
          <div className="space-y-5 pt-2">
            {/* Hipertensión */}
            <div className="space-y-2">
              <SiNo label="Hipertensión" name="hipertension" value={form.hipertension} onChange={setSiNo} />
              {form.hipertension === 'Sí' && (
                <div className="pl-4 border-l-4 border-orange-300 bg-orange-50 p-3 rounded-r-lg space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Seleccione los medicamentos:</p>
                  <CheckboxList items={MEDS_HIPERTENSION} selected={form.medsHipertension}
                    onChange={(item) => toggleArray('medsHipertension', item)} />
                  {form.medsHipertension.includes('Otros') && (
                    <input placeholder="Especifique el medicamento" value={form.otroMedHipertension}
                      onChange={e => set('otroMedHipertension', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm" />
                  )}
                </div>
              )}
            </div>

            {/* Diabetes */}
            <div className="space-y-2">
              <SiNo label="Diabetes" name="diabetes" value={form.diabetes} onChange={setSiNo} />
              {form.diabetes === 'Sí' && (
                <div className="pl-4 border-l-4 border-orange-300 bg-orange-50 p-3 rounded-r-lg space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Seleccione los medicamentos:</p>
                  <CheckboxList items={MEDS_DIABETES} selected={form.medsDiabetes}
                    onChange={(item) => toggleArray('medsDiabetes', item)} />
                  {form.medsDiabetes.includes('Otros') && (
                    <input placeholder="Especifique el medicamento" value={form.otroMedDiabetes}
                      onChange={e => set('otroMedDiabetes', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm" />
                  )}
                </div>
              )}
            </div>

            {/* Colesterol */}
            <div className="space-y-2">
              <SiNo label="Colesterol elevado" name="colesterol" value={form.colesterol} onChange={setSiNo} />
              {form.colesterol === 'Sí' && (
                <div className="pl-4 border-l-4 border-orange-300 bg-orange-50 p-3 rounded-r-lg space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Seleccione los medicamentos:</p>
                  <CheckboxList items={MEDS_COLESTEROL} selected={form.medsColesterol}
                    onChange={(item) => toggleArray('medsColesterol', item)} />
                  {form.medsColesterol.includes('Otros') && (
                    <input placeholder="Especifique el medicamento" value={form.otroMedColesterol}
                      onChange={e => set('otroMedColesterol', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm" />
                  )}
                </div>
              )}
            </div>

            {/* Estrés */}
            <div className="space-y-2">
              <SiNo label="Estrés / Angustia / Ansiedad / Depresión" name="estresAnsiedad" value={form.estresAnsiedad} onChange={setSiNo} />
              {form.estresAnsiedad === 'Sí' && (
                <textarea rows={2} placeholder="Si desea, especifique (opcional)..."
                  value={form.estresDetalle} onChange={e => set('estresDetalle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none" />
              )}
            </div>

            {/* Otras */}
            <div className="space-y-2">
              <SiNo label="Otras patologías" name="otrasPatologias" value={form.otrasPatologias} onChange={setSiNo} />
              {form.otrasPatologias === 'Sí' && (
                <textarea rows={2} placeholder="Especifique las patologías..."
                  value={form.otrasPatologiasDetalle} onChange={e => set('otrasPatologiasDetalle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══ SECCIÓN 4 — HÁBITOS ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <SeccionHeader num="4" titulo="Hábitos" color="green" />
        <SiNo label="¿Fuma actualmente?" name="fuma" value={form.fuma} onChange={setSiNo} />
        {form.fuma === 'No' && (
          <SiNo label="¿Fumó por mucho tiempo en el pasado?" name="fumoPorMucho" value={form.fumoPorMucho} onChange={setSiNo} />
        )}
        <SiNo label="¿Alguna vez tuvo un infarto, ACV o Trombosis arterial?" name="tuvoCvAntes" value={form.tuvoCvAntes} onChange={setSiNo} />
        <SiNo label="¿Tiene Enfermedad Renal Crónica o Insuficiencia Cardíaca?" name="enfermedadRenal" value={form.enfermedadRenal} onChange={setSiNo} />
        <SiNo label="¿Consume bebidas alcohólicas de manera habitual?" name="consumeAlcohol" value={form.consumeAlcohol} onChange={setSiNo} />
        <SiNo label="¿Duerme entre 6 y 8 horas diarias?" name="duerme68" value={form.duerme68} onChange={setSiNo} />
        <SiNo label="¿Realiza actividad física 150 minutos semanales?" name="actividadFisica" value={form.actividadFisica} onChange={setSiNo} />
      </div>

      {/* ══ SECCIÓN 5 — SÍNTOMAS ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <SeccionHeader num="5" titulo="Síntomas de Alarma" color="red" />
        <CheckList items={SINTOMAS} selected={form.sintomas}
          onChange={(item) => toggleArray('sintomas', item)} color="red" />
        {form.sintomas.includes('Otro') && (
          <input placeholder="Especifique el síntoma..."
            value={form.sintomaOtro} onChange={e => set('sintomaOtro', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm mt-1" />
        )}
      </div>

      {/* ══ SECCIÓN 6 — DATOS ANTROPOMÉTRICOS ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <SeccionHeader num="6" titulo="Datos Antropométricos y Clínicos" color="indigo" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Peso (kg)', name: 'peso', placeholder: 'Ej: 75' },
            { label: 'Talla (cm)', name: 'talla', placeholder: 'Ej: 170' },
            { label: 'Tensión Máxima (mmHg)', name: 'tensionSistolica', placeholder: 'Ej: 120' },
            { label: 'Tensión Mínima (mmHg)', name: 'tensionDiastolica', placeholder: 'Ej: 80' },
          ].map(({ label, name, placeholder }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="number" name={name} value={form[name]} onChange={handle} placeholder={placeholder}
                className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Cintura (cm)</label>
            <input type="number" name="cintura" value={form.cintura} onChange={handle} placeholder="Ej: 90"
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-2" />
            <div className="flex gap-2">
              <button type="button" onClick={() => set('cintura', '89')}
                className="flex-1 text-xs py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Mayor que 88 cm
              </button>
              <button type="button" onClick={() => set('cintura', '88')}
                className="flex-1 text-xs py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Menor o igual a 88 cm
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">IMC</p>
            <p className="text-xl font-bold text-indigo-800">
              {imc ? `${imc.valor} — ${imc.clasificacion}` : 'Ingresá peso y talla'}
            </p>
          </div>
          <div className={`p-4 rounded-lg border-2 ${obtenerColorRiesgo(nivelRiesgo)}`}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">Riesgo Cardiovascular</p>
            <p className="text-xl font-bold">{nivelRiesgo || 'Completá los datos necesarios'}</p>
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 7 — ESTUDIOS COMPLEMENTARIOS ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <SeccionHeader num="7" titulo="Estudios Complementarios" color="indigo" />

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 space-y-3">
          <p className="text-sm font-bold text-yellow-800">📋 ¿Cómo subir la foto del estudio?</p>
          <ol className="text-sm text-yellow-900 space-y-1 list-decimal list-inside">
            <li>Hacé clic en el botón azul <strong>"Abrir ImgBB para subir foto"</strong></li>
            <li>En la página que se abre, hacé clic en <strong>"Start uploading"</strong></li>
            <li>Elegí la foto del estudio desde la computadora o el celular</li>
            <li>Una vez subida, copiá el link que aparece abajo de la imagen</li>
            <li>Volvé a esta página y pegá el link en el campo correspondiente</li>
          </ol>
          <button type="button"
            onClick={() => window.open('https://imgbb.com/upload', '_blank', 'noopener,noreferrer')}
            className="mt-2 w-full py-3 bg-blue-600 text-white font-bold text-base rounded-lg hover:bg-blue-700 transition-colors shadow">
            📤 Abrir ImgBB para subir foto
          </button>
        </div>

        {[
          { label: 'Electrocardiograma', name: 'linkElectrocardiograma' },
          { label: 'Ecocardiograma', name: 'linkEcocardiograma' },
          { label: 'Laboratorio', name: 'linkLaboratorio' },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Link — {label} <span className="text-gray-400 font-normal">(pegá acá el link de ImgBB)</span>
            </label>
            <input type="url" name={name} value={form[name]} onChange={handle}
              placeholder="https://ibb.co/..."
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        ))}

        <SiNo label="¿Tiene otro estudio para cargar?" name="tieneOtroEstudio" value={form.tieneOtroEstudio} onChange={setSiNo} />
        {form.tieneOtroEstudio === 'Sí' && (
          <div className="space-y-3 pl-4 border-l-4 border-indigo-200">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Nombre del estudio</label>
              <input name="nombreOtroEstudio" value={form.nombreOtroEstudio} onChange={handle}
                placeholder="Ej: Holter, Ergometría..."
                className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Link del estudio <span className="text-gray-400 font-normal">(de ImgBB)</span>
              </label>
              <input type="url" name="linkOtroEstudio" value={form.linkOtroEstudio} onChange={handle}
                placeholder="https://ibb.co/..."
                className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        )}
      </div>

      {/* ── BOTÓN GUARDAR ── */}
      {errorGuardado && <p className="text-red-500 text-sm w-full">{errorGuardado}</p>}
      {mensajeGuardado && <p className="text-green-600 font-semibold text-sm w-full">✅ {mensajeGuardado}</p>}
      <button type="button" onClick={guardar} disabled={guardando}
        className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg">
        {guardando ? 'Guardando...' : '💾 Guardar registro completo'}
      </button>

      {/* ══ BUSCADOR ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">🔍 Buscar registros por DNI</h2>
        <div className="flex gap-3">
          <input value={dniBusqueda} onChange={e => setDniBusqueda(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarEstudios()}
            placeholder="Ingresá el DNI"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="button" onClick={buscarEstudios} disabled={cargandoEstudios}
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {cargandoEstudios ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {errorBusqueda && <p className="text-red-500 text-sm">{errorBusqueda}</p>}
      </div>

      {/* ══ TARJETAS DE ESTUDIOS ══ */}
      {estudios.length > 0 && (
        <div className="w-full space-y-4">
          <h3 className="text-lg font-bold text-gray-700">Registros encontrados ({estudios.length})</h3>
          {estudios.map((est) => (
            <div key={est.id} className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="text-lg font-bold text-gray-800">DNI: {est.dni}</p>
                  {est.edad && <p className="text-sm text-gray-500">Edad: {est.edad} años — {est.genero}</p>}
                  {est.fechaCarga && (
                    <p className="text-xs text-gray-400">
                      Cargado: {new Date(est.fechaCarga).toLocaleDateString('es-AR')}
                    </p>
                  )}
                  {est.nivelRiesgo && (
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${obtenerColorRiesgo(est.nivelRiesgo)}`}>
                      Riesgo: {est.nivelRiesgo}
                    </span>
                  )}
                  {est.imc && (
                    <span className="inline-block ml-2 mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      IMC: {est.imc} ({est.imcClasificacion})
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEstudiosEdit({ ...est })}
                    className="px-3 py-1.5 text-sm bg-amber-100 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-200 font-semibold transition-colors">
                    ✏️ Editar
                  </button>
                  <button type="button" onClick={() => eliminarEstudio(est.id)}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 font-semibold transition-colors">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>

              {/* Botones de estudios */}
              <div className="flex flex-wrap gap-2">
                {est.linkElectrocardiograma
                  ? <button type="button" onClick={() => abrirLink(est.linkElectrocardiograma)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors shadow-sm text-sm">
                      ❤️ Electrocardiograma
                    </button>
                  : <span className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-sm">Sin ECG</span>
                }
                {est.linkEcocardiograma
                  ? <button type="button" onClick={() => abrirLink(est.linkEcocardiograma)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm">
                      🫀 Ecocardiograma
                    </button>
                  : <span className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-sm">Sin Eco</span>
                }
                {est.linkLaboratorio
                  ? <button type="button" onClick={() => abrirLink(est.linkLaboratorio)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm text-sm">
                      🧪 Laboratorio
                    </button>
                  : <span className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-sm">Sin Lab</span>
                }
                {est.linkOtroEstudio && (
                  <button type="button" onClick={() => abrirLink(est.linkOtroEstudio)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors shadow-sm text-sm">
                    📄 {est.nombreOtroEstudio || 'Otro estudio'}
                  </button>
                )}
              </div>

              {/* Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { link: est.linkElectrocardiograma, label: 'Electrocardiograma' },
                  { link: est.linkEcocardiograma, label: 'Ecocardiograma' },
                  { link: est.linkLaboratorio, label: 'Laboratorio' },
                  { link: est.linkOtroEstudio, label: est.nombreOtroEstudio || 'Otro' },
                ].filter(x => x.link).map(({ link, label }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{label}</p>
                    <img src={link} alt={label}
                      className="w-full rounded-lg border border-gray-200 shadow-sm object-contain max-h-60"
                      onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MODAL EDITAR ══ */}
      {estudiosEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800">✏️ Editar registro — DNI {estudiosEdit.dni}</h3>
            {[
              { label: 'Link Electrocardiograma', key: 'linkElectrocardiograma' },
              { label: 'Link Ecocardiograma', key: 'linkEcocardiograma' },
              { label: 'Link Laboratorio', key: 'linkLaboratorio' },
              { label: 'Nombre otro estudio', key: 'nombreOtroEstudio' },
              { label: 'Link otro estudio', key: 'linkOtroEstudio' },
            ].map(({ label, key }) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input value={estudiosEdit[key] || ''}
                  onChange={e => setEstudiosEdit(prev => ({ ...prev, [key]: e.target.value }))}
                  className="p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={guardarEdicion} disabled={guardandoEdit}
                className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {guardandoEdit ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button type="button" onClick={() => setEstudiosEdit(null)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioEnfermera;