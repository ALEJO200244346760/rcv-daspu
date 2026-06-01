import React, { useState, useEffect, useCallback } from 'react';
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
  "Stent","Bypass","Valvulopatía","Arritmias","Enfermedad renal crónica",
  "Insuficiencia cardíaca"
];
const SINTOMAS = [
  "Dolor en el pecho o falta de aire al hacer esfuerzos",
  "Hinchazón de piernas, manos o cara por la tarde",
  "Diuresis nocturna","Palpitaciones",
  "Mareos / desmayos / pérdidas de conocimiento","Otro","Ninguno"
];

// ─────────────────────────────────────────────────────────────
// HELPERS UI
// ─────────────────────────────────────────────────────────────
const SiNo = ({ label, value, onChange, name }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="flex gap-2">
      {['Sí','No'].map(op => (
        <button key={op} type="button" onClick={() => onChange(name, op)}
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
  const colorMap = {
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-800', border: 'border-indigo-200' },
    red:    { bg: 'bg-red-500',    text: 'text-red-800',    border: 'border-red-200'    },
    orange: { bg: 'bg-orange-500', text: 'text-orange-800', border: 'border-orange-200' },
    green:  { bg: 'bg-green-600',  text: 'text-green-800',  border: 'border-green-200'  },
    pink:   { bg: 'bg-pink-500',   text: 'text-pink-800',   border: 'border-pink-200'   },
  };
  const { bg, text, border } = colorMap[color] || colorMap.indigo;
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

const Fila = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-2 py-1 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 w-40 shrink-0">{label}</span>
      <span className="text-xs text-gray-800">{value}</span>
    </div>
  );
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
  consumeAlcohol: '', duerme68: '', actividadFisica: '',
  sintomas: [], sintomaOtro: '',
  peso: '', talla: '', cintura: '', tensionSistolica: '', tensionDiastolica: '',
  linkElectrocardiograma: '', linkEcocardiograma: '', linkLaboratorio: '',
  tieneOtroEstudio: '', linkOtroEstudio: '', nombreOtroEstudio: '',
};

// ─────────────────────────────────────────────────────────────
// MODAL DETALLE PACIENTE
// ─────────────────────────────────────────────────────────────
const ModalDetalle = ({ est, onClose }) => {
  let eventosCvObj = {};
  try { eventosCvObj = JSON.parse(est.eventosCv || '{}'); } catch {}
  const eventosActivos = Object.entries(eventosCvObj).filter(([,v]) => v).map(([k]) => k);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Ficha del paciente</h3>
            <p className="text-sm text-gray-500">DNI: {est.dni} — {est.genero} — {est.edad ? `${est.edad} años` : '—'}</p>
          </div>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Badges riesgo / IMC */}
          <div className="flex flex-wrap gap-2">
            {est.nivelRiesgo && (
              <span className={`px-3 py-1 text-sm font-bold rounded-full ${obtenerColorRiesgo(est.nivelRiesgo)}`}>
                Riesgo: {est.nivelRiesgo}
              </span>
            )}
            {est.imc && (
              <span className="px-3 py-1 text-sm font-bold rounded-full bg-indigo-100 text-indigo-800">
                IMC: {est.imc} ({est.imcClasificacion})
              </span>
            )}
            {est.fechaCarga && (
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600">
                {new Date(est.fechaCarga).toLocaleDateString('es-AR')}
              </span>
            )}
          </div>

          {/* Sección 1 */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Datos filiatorios</p>
            <Fila label="Fecha de nacimiento" value={est.fechaNacimiento} />
            <Fila label="Teléfono" value={est.telefono} />
            {est.genero === 'femenino' && <>
              <Fila label="Tuvo hijos" value={est.tuvoHijos} />
              <Fila label="Complicaciones embarazo" value={est.complicacionesEmbarazo} />
            </>}
          </div>

          {/* Sección 2 */}
          {eventosActivos.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Eventos cardiovasculares</p>
              <div className="flex flex-wrap gap-1">
                {eventosActivos.map(ev => (
                  <span key={ev} className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">{ev}</span>
                ))}
              </div>
            </div>
          )}

          {/* Sección 3 */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">Factores de riesgo / Medicación</p>
            <Fila label="Toma medicación" value={est.tomaMedicacion} />
            <Fila label="Hipertensión" value={est.hipertension} />
            <Fila label="Meds. hipertensión" value={est.medsHipertension} />
            <Fila label="Otro med. HTA" value={est.otroMedHipertension} />
            <Fila label="Diabetes" value={est.diabetes} />
            <Fila label="Meds. diabetes" value={est.medsDiabetes} />
            <Fila label="Otro med. diabetes" value={est.otroMedDiabetes} />
            <Fila label="Colesterol elevado" value={est.colesterol} />
            <Fila label="Meds. colesterol" value={est.medsColesterol} />
            <Fila label="Otro med. colesterol" value={est.otroMedColesterol} />
            <Fila label="Estrés/Ansiedad" value={est.estresAnsiedad} />
            <Fila label="Detalle estrés" value={est.estresDetalle} />
            <Fila label="Otras patologías" value={est.otrasPatologias} />
            <Fila label="Detalle patologías" value={est.otrasPatologiasDetalle} />
          </div>

          {/* Sección 4 */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">Hábitos</p>
            <Fila label="Fuma" value={est.fuma} />
            <Fila label="Fumó en el pasado" value={est.fumoPorMucho} />
            <Fila label="Consume alcohol" value={est.consumeAlcohol} />
            <Fila label="Duerme 6-8 hs" value={est.duerme68} />
            <Fila label="Actividad física" value={est.actividadFisica} />
          </div>

          {/* Sección 5 */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Síntomas de alarma</p>
            <Fila label="Síntomas" value={est.sintomas} />
            <Fila label="Otro síntoma" value={est.sintomaOtro} />
          </div>

          {/* Sección 6 */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Datos antropométricos</p>
            <Fila label="Peso" value={est.peso ? `${est.peso} kg` : null} />
            <Fila label="Talla" value={est.talla ? `${est.talla} cm` : null} />
            <Fila label="Cintura" value={est.cintura ? `${est.cintura} cm` : null} />
            <Fila label="TA Máxima" value={est.tensionSistolica ? `${est.tensionSistolica} mmHg` : null} />
            <Fila label="TA Mínima" value={est.tensionDiastolica ? `${est.tensionDiastolica} mmHg` : null} />
          </div>

          {/* Sección 7 — estudios */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Estudios complementarios</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {est.linkElectrocardiograma && (
                <a href={est.linkElectrocardiograma} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-rose-500 text-white text-sm font-semibold rounded-lg hover:bg-rose-600">
                  ❤️ Electrocardiograma
                </a>
              )}
              {est.linkEcocardiograma && (
                <a href={est.linkEcocardiograma} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600">
                  🫀 Ecocardiograma
                </a>
              )}
              {est.linkLaboratorio && (
                <a href={est.linkLaboratorio} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600">
                  🧪 Laboratorio
                </a>
              )}
              {est.linkOtroEstudio && (
                <a href={est.linkOtroEstudio} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg hover:bg-purple-600">
                  📄 {est.nombreOtroEstudio || 'Otro estudio'}
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { link: est.linkElectrocardiograma, label: 'Electrocardiograma' },
                { link: est.linkEcocardiograma,     label: 'Ecocardiograma'     },
                { link: est.linkLaboratorio,         label: 'Laboratorio'        },
                { link: est.linkOtroEstudio,         label: est.nombreOtroEstudio || 'Otro' },
              ].filter(x => x.link).map(({ link, label }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
                  <img src={link} alt={label}
                    className="w-full rounded-lg border border-gray-200 object-contain max-h-56"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3 rounded-b-2xl">
          <button onClick={onClose}
            className="w-full py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
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

  // Todos los estudios + búsqueda
  const [todosEstudios, setTodosEstudios] = useState([]);
  const [estudiosFiltrados, setEstudiosFiltrados] = useState([]);
  const [cargandoEstudios, setCargandoEstudios] = useState(false);
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState('');

  // Modales
  const [estudiosEdit, setEstudiosEdit] = useState(null);
  const [guardandoEdit, setGuardandoEdit] = useState(false);
  const [detalleEstudio, setDetalleEstudio] = useState(null);

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

  // Riesgo automático
  useEffect(() => {
    const { edad, genero, diabetes, fuma, tensionSistolica, eventosCv, enfermedadRenal } = form;
    if (!edad || !genero || !tensionSistolica) { setNivelRiesgo(''); return; }
    const tieneEventoGrave =
      eventosCv['Infarto'] || eventosCv['Accidente cerebrovascular'] ||
      eventosCv['Trombosis arterial'] || eventosCv['Insuficiencia cardíaca'] ||
      enfermedadRenal === 'Sí' || diabetes === 'Sí';
    if (tieneEventoGrave) { setNivelRiesgo('>20% <30% Alto'); return; }
    const ajustarEdad = (e) => e < 50 ? 40 : e <= 59 ? 50 : e <= 69 ? 60 : 70;
    const ajustarPresion = (p) => p < 140 ? 120 : p <= 159 ? 140 : p <= 179 ? 160 : 180;
    try {
      const r = calcularRiesgoCardiovascular(
        ajustarEdad(parseInt(edad)), genero,
        diabetes === 'Sí' ? 'Sí' : 'No',
        fuma === 'Sí' ? 'sí' : 'no',
        ajustarPresion(parseInt(tensionSistolica)), null
      );
      setNivelRiesgo(r);
    } catch { setNivelRiesgo(''); }
  }, [form.edad, form.genero, form.diabetes, form.fuma, form.tensionSistolica, form.eventosCv, form.enfermedadRenal]);

  // Cargar TODOS los estudios al montar
  const cargarTodos = useCallback(async () => {
    setCargandoEstudios(true);
    try {
      const { data } = await axiosInstance.get('/api/estudios/todos');
      const lista = Array.isArray(data) ? data : [];
      setTodosEstudios(lista);
      setEstudiosFiltrados(lista);
    } catch {
      // Si el endpoint devuelve 404 porque no hay nada, simplemente queda vacío
      setTodosEstudios([]);
      setEstudiosFiltrados([]);
    } finally { setCargandoEstudios(false); }
  }, []);

  useEffect(() => { cargarTodos(); }, [cargarTodos]);

  // Filtrar por DNI (lupa)
  const buscar = () => {
    setErrorBusqueda('');
    const q = dniBusqueda.trim();
    if (!q) { setEstudiosFiltrados(todosEstudios); return; }
    const filtrados = todosEstudios.filter(e => e.dni?.includes(q));
    if (filtrados.length === 0) setErrorBusqueda('No se encontraron registros para ese DNI.');
    setEstudiosFiltrados(filtrados);
  };

  const limpiarBusqueda = () => {
    setDniBusqueda('');
    setErrorBusqueda('');
    setEstudiosFiltrados(todosEstudios);
  };

  const imc = calcularIMC(form.peso, form.talla);

  const guardar = async () => {
    if (!form.dni || form.dni.length < 7) { setErrorGuardado('El DNI debe tener al menos 7 dígitos.'); return; }
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
      cargarTodos();
    } catch (e) {
      console.error(e);
      setErrorGuardado('Error al guardar. Revisá los datos.');
    } finally { setGuardando(false); }
  };

  const eliminarEstudio = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este registro?')) return;
    try {
      await axiosInstance.delete(`/api/estudios/${id}`);
      const nuevos = todosEstudios.filter(e => e.id !== id);
      setTodosEstudios(nuevos);
      setEstudiosFiltrados(nuevos.filter(e => !dniBusqueda.trim() || e.dni?.includes(dniBusqueda.trim())));
    } catch { alert('Error al eliminar.'); }
  };

  const guardarEdicion = async () => {
    setGuardandoEdit(true);
    try {
      await axiosInstance.put(`/api/estudios/${estudiosEdit.id}`, estudiosEdit);
      const actualizar = prev => prev.map(e => e.id === estudiosEdit.id ? estudiosEdit : e);
      setTodosEstudios(actualizar);
      setEstudiosFiltrados(actualizar);
      setEstudiosEdit(null);
    } catch { alert('Error al guardar cambios.'); }
    finally { setGuardandoEdit(false); }
  };

  const abrirLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  // ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center p-4 md:p-8 max-w-3xl mx-auto space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-gray-900 w-full">Panel de Enfermería</h1>

      {/* ══ SECCIÓN 1 ══ */}
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
                  form.genero === g ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}>{g.charAt(0).toUpperCase() + g.slice(1)}</button>
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

      {/* ══ SECCIÓN 2 ══ */}
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

      {/* ══ SECCIÓN 3 ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <SeccionHeader num="3" titulo="Factores de Riesgo Cardiovascular" color="orange" />
        <SiNo label="¿Toma medicación a diario?" name="tomaMedicacion" value={form.tomaMedicacion} onChange={setSiNo} />
        {form.tomaMedicacion === 'Sí' && (
          <div className="space-y-5 pt-2">
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
            <div className="space-y-2">
              <SiNo label="Estrés / Angustia / Ansiedad / Depresión" name="estresAnsiedad" value={form.estresAnsiedad} onChange={setSiNo} />
              {form.estresAnsiedad === 'Sí' && (
                <textarea rows={2} placeholder="Si desea, especifique (opcional)..."
                  value={form.estresDetalle} onChange={e => set('estresDetalle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none" />
              )}
            </div>
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

      {/* ══ SECCIÓN 4 ══ */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <SeccionHeader num="4" titulo="Hábitos" color="green" />
        <SiNo label="¿Fuma actualmente?" name="fuma" value={form.fuma} onChange={setSiNo} />
        {form.fuma === 'No' && (
          <SiNo label="¿Fumó por mucho tiempo en el pasado?" name="fumoPorMucho" value={form.fumoPorMucho} onChange={setSiNo} />
        )}
        <SiNo label="¿Consume bebidas alcohólicas de manera habitual?" name="consumeAlcohol" value={form.consumeAlcohol} onChange={setSiNo} />
        <SiNo label="¿Duerme entre 6 y 8 horas diarias?" name="duerme68" value={form.duerme68} onChange={setSiNo} />
        <SiNo label="¿Realiza actividad física 150 minutos semanales?" name="actividadFisica" value={form.actividadFisica} onChange={setSiNo} />
      </div>

      {/* ══ SECCIÓN 5 ══ */}
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

      {/* ══ SECCIÓN 6 ══ */}
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
                className="flex-1 text-xs py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Mayor que 88 cm</button>
              <button type="button" onClick={() => set('cintura', '88')}
                className="flex-1 text-xs py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Menor o igual a 88 cm</button>
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

      {/* ══ SECCIÓN 7 ══ */}
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
            <input type="url" name={name} value={form[name]} onChange={handle} placeholder="https://ibb.co/..."
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

      {/* ══ LISTADO DE REGISTROS ══ */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-800">
            Registros {estudiosFiltrados.length > 0 && `(${estudiosFiltrados.length})`}
          </h2>
          {/* Buscador por lupa */}
          <div className="flex gap-2">
            <input value={dniBusqueda} onChange={e => setDniBusqueda(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
              placeholder="Buscar por DNI..."
              className="p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 w-44" />
            <button type="button" onClick={buscar}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-semibold">
              🔍
            </button>
            {dniBusqueda && (
              <button type="button" onClick={limpiarBusqueda}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-semibold">
                ✕
              </button>
            )}
          </div>
        </div>

        {errorBusqueda && <p className="text-red-500 text-sm">{errorBusqueda}</p>}
        {cargandoEstudios && <p className="text-gray-400 text-sm">Cargando registros...</p>}

        {estudiosFiltrados.length === 0 && !cargandoEstudios && (
          <p className="text-gray-400 text-sm text-center py-8">No hay registros cargados aún.</p>
        )}

        {estudiosFiltrados.map((est) => (
          <div key={est.id} className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-3">
            {/* Encabezado tarjeta */}
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="text-lg font-bold text-gray-800">DNI: {est.dni}</p>
                {est.edad && <p className="text-sm text-gray-500">{est.edad} años — {est.genero}</p>}
                {est.fechaCarga && (
                  <p className="text-xs text-gray-400">{new Date(est.fechaCarga).toLocaleDateString('es-AR')}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  {est.nivelRiesgo && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${obtenerColorRiesgo(est.nivelRiesgo)}`}>
                      Riesgo: {est.nivelRiesgo}
                    </span>
                  )}
                  {est.imc && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      IMC: {est.imc}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={() => setDetalleEstudio(est)}
                  className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg hover:bg-indigo-200 font-semibold transition-colors">
                  👁 Ver detalle
                </button>
                <button type="button" onClick={() => setEstudiosEdit({ ...est })}
                  className="px-3 py-1.5 text-sm bg-amber-100 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-200 font-semibold transition-colors">
                  ✏️ Editar
                </button>
                <button type="button" onClick={() => eliminarEstudio(est.id)}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 font-semibold transition-colors">
                  🗑️
                </button>
              </div>
            </div>

            {/* Botones de estudios en la tarjeta */}
            <div className="flex flex-wrap gap-2">
              {est.linkElectrocardiograma
                ? <button type="button" onClick={() => abrirLink(est.linkElectrocardiograma)}
                    className="flex items-center gap-1 px-3 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 text-xs">
                    ❤️ ECG
                  </button>
                : <span className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">Sin ECG</span>
              }
              {est.linkEcocardiograma
                ? <button type="button" onClick={() => abrirLink(est.linkEcocardiograma)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 text-xs">
                    🫀 Eco
                  </button>
                : <span className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">Sin Eco</span>
              }
              {est.linkLaboratorio
                ? <button type="button" onClick={() => abrirLink(est.linkLaboratorio)}
                    className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 text-xs">
                    🧪 Lab
                  </button>
                : <span className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">Sin Lab</span>
              }
              {est.linkOtroEstudio && (
                <button type="button" onClick={() => abrirLink(est.linkOtroEstudio)}
                  className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 text-xs">
                  📄 {est.nombreOtroEstudio || 'Otro'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ══ MODAL DETALLE ══ */}
      {detalleEstudio && (
        <ModalDetalle est={detalleEstudio} onClose={() => setDetalleEstudio(null)} />
      )}

      {/* ══ MODAL EDITAR ══ */}
      {estudiosEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800">✏️ Editar estudios — DNI {estudiosEdit.dni}</h3>
            {[
              { label: 'Link Electrocardiograma', key: 'linkElectrocardiograma' },
              { label: 'Link Ecocardiograma',     key: 'linkEcocardiograma'     },
              { label: 'Link Laboratorio',         key: 'linkLaboratorio'        },
              { label: 'Nombre otro estudio',      key: 'nombreOtroEstudio'      },
              { label: 'Link otro estudio',        key: 'linkOtroEstudio'        },
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