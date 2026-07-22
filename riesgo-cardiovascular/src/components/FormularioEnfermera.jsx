import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { calcularRiesgoCardiovascular } from './Calculadora';
import { ESTADO_INICIAL } from './enfermera/EnfermeraConstantes';
import { calcularIMC } from './enfermera/EnfermeraUtils';
import {
  SeccionFiliatorios, SeccionEventoCV, SeccionFactoresRiesgo,
  SeccionHabitos, SeccionSintomas, SeccionAntropometrica, SeccionEstudios
} from './enfermera/SeccionesFormulario';
import TarjetaEstudio from './enfermera/TarjetaEstudio';
import ModalDetallePaciente from './enfermera/ModalDetallePaciente';
import ModalEditarEstudio from './enfermera/ModalEditarEstudio';

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL — solo estado y lógica
// ─────────────────────────────────────────────────────────────
const FormularioEnfermera = () => {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [nivelRiesgo, setNivelRiesgo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [errorGuardado, setErrorGuardado] = useState('');

  const [todosEstudios, setTodosEstudios] = useState([]);
  const [estudiosFiltrados, setEstudiosFiltrados] = useState([]);
  const [cargandoEstudios, setCargandoEstudios] = useState(false);
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const [detalleEstudio, setDetalleEstudio] = useState(null);
  const [estudiosEdit, setEstudiosEdit] = useState(null);
  const [guardandoEdit, setGuardandoEdit] = useState(false);

  // ── Helpers de estado ────────────────────────────────────
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

  // ── Edad automática ──────────────────────────────────────
  useEffect(() => {
    if (!form.fechaNacimiento) { set('edad', ''); return; }
    const hoy = new Date();
    const nac = new Date(form.fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() ||
       (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) edad--;
    set('edad', edad >= 0 ? String(edad) : '');
  }, [form.fechaNacimiento]);

  // ── Riesgo automático ────────────────────────────────────
  useEffect(() => {
    const { edad, genero, diabetes, fuma, tensionSistolica, eventosCv } = form;
    if (!edad || !genero || !tensionSistolica) { setNivelRiesgo(''); return; }

    const tieneEventoGrave =
      eventosCv['Infarto'] || eventosCv['Accidente cerebrovascular'] ||
      eventosCv['Trombosis arterial'] || eventosCv['Insuficiencia cardíaca'] ||
      eventosCv['Enfermedad renal crónica'] || diabetes === 'Sí';

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
  }, [form.edad, form.genero, form.diabetes, form.fuma, form.tensionSistolica, form.eventosCv]);

  // ── Cargar todos los estudios al montar ──────────────────
  const cargarTodos = useCallback(async () => {
    setCargandoEstudios(true);
    try {
      const { data } = await axiosInstance.get('/api/estudios/todos');
      const lista = Array.isArray(data) ? data : [];
      setTodosEstudios(lista);
      setEstudiosFiltrados(lista);
    } catch {
      setTodosEstudios([]);
      setEstudiosFiltrados([]);
    } finally { setCargandoEstudios(false); }
  }, []);

  useEffect(() => { cargarTodos(); }, [cargarTodos]);

  // ── Búsqueda local ───────────────────────────────────────
  const buscar = () => {
    setErrorBusqueda('');

    const q = dniBusqueda.trim().toLowerCase();

    if (!q) {
      setEstudiosFiltrados(todosEstudios);
      return;
    }

    const filtrados = todosEstudios.filter(e => {
      const dni = (e.dni || '').toString();
      const nombre = (e.nombre || '').toLowerCase();
      const apellido = (e.apellido || '').toLowerCase();

      const nombreCompleto = `${nombre} ${apellido}`;
      const apellidoNombre = `${apellido} ${nombre}`;

      return (
        dni.includes(q) ||
        nombre.includes(q) ||
        apellido.includes(q) ||
        nombreCompleto.includes(q) ||
        apellidoNombre.includes(q)
      );
    });

    if (filtrados.length === 0) {
      setErrorBusqueda('No se encontraron registros.');
    }

    setEstudiosFiltrados(filtrados);
  };

  const limpiarBusqueda = () => {
    setDniBusqueda('');
    setErrorBusqueda('');
    setEstudiosFiltrados(todosEstudios);
  };

  // ── Guardar ──────────────────────────────────────────────
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
      setForm(ESTADO_INICIAL);
      setNivelRiesgo('');
      cargarTodos();
    } catch (e) {
      console.error(e);
      setErrorGuardado('Error al guardar. Revisá los datos.');
    } finally { setGuardando(false); }
  };

  // ── Eliminar ─────────────────────────────────────────────
  const eliminarEstudio = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este registro?')) return;
    try {
      await axiosInstance.delete(`/api/estudios/${id}`);
      const nuevos = todosEstudios.filter(e => e.id !== id);
      setTodosEstudios(nuevos);
      setEstudiosFiltrados(nuevos.filter(e => !dniBusqueda.trim() || e.dni?.includes(dniBusqueda.trim())));
    } catch { alert('Error al eliminar.'); }
  };

  // ── Editar ───────────────────────────────────────────────
  const guardarEdicion = async () => {
    setGuardandoEdit(true);
    try {
      await axiosInstance.put(`/api/estudios/${estudiosEdit.id}`, estudiosEdit);
      const actualizar = (lista) => lista.map(e => e.id === estudiosEdit.id ? estudiosEdit : e);
      setTodosEstudios(prev => actualizar(prev));
      setEstudiosFiltrados(prev => actualizar(prev));
      // Si el modal de detalle estaba abierto con el mismo registro, actualizarlo
      if (detalleEstudio?.id === estudiosEdit.id) setDetalleEstudio(estudiosEdit);
      setEstudiosEdit(null);
    } catch { alert('Error al guardar cambios.'); }
    finally { setGuardandoEdit(false); }
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center p-4 md:p-8 max-w-3xl mx-auto space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-gray-900 w-full">Circuito CardioVascular</h1>

      <SeccionFiliatorios form={form} set={set} handle={handle} setSiNo={setSiNo} toggleArray={toggleArray} />
      <SeccionEventoCV form={form} toggleEvento={toggleEvento} />
      <SeccionFactoresRiesgo form={form} set={set} setSiNo={setSiNo} toggleArray={toggleArray} />
      <SeccionHabitos form={form} setSiNo={setSiNo} />
      <SeccionSintomas form={form} set={set} toggleArray={toggleArray} />
      <SeccionAntropometrica form={form} set={set} handle={handle} nivelRiesgo={nivelRiesgo} />
      <SeccionEstudios form={form} set={set} handle={handle} setSiNo={setSiNo} />

      {/* Botón guardar */}
      {errorGuardado && <p className="text-red-500 text-sm w-full">{errorGuardado}</p>}
      {mensajeGuardado && <p className="text-green-600 font-semibold text-sm w-full">✅ {mensajeGuardado}</p>}
      <button type="button" onClick={guardar} disabled={guardando}
        className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg">
        {guardando ? 'Guardando...' : '💾 Guardar registro completo'}
      </button>

      {/* Listado con buscador */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-800">
            Registros{estudiosFiltrados.length > 0 ? ` (${estudiosFiltrados.length})` : ''}
          </h2>
          <div className="flex gap-2">
            <input value={dniBusqueda} onChange={e => setDniBusqueda(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
              placeholder="Buscar por DNI, nombre o apellido"
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

        {estudiosFiltrados.map(est => (
          <TarjetaEstudio
            key={est.id}
            est={est}
            onVerDetalle={setDetalleEstudio}
            onEditar={e => setEstudiosEdit({ ...e })}
            onEliminar={eliminarEstudio}
          />
        ))}
      </div>

      {/* Modales */}
      {detalleEstudio && (
        <ModalDetallePaciente est={detalleEstudio} onClose={() => setDetalleEstudio(null)} />
      )}
      {estudiosEdit && (
        <ModalEditarEstudio
          estudio={estudiosEdit}
          guardando={guardandoEdit}
          onChange={(key, val) => setEstudiosEdit(prev => ({ ...prev, [key]: val }))}
          onGuardar={guardarEdicion}
          onCerrar={() => setEstudiosEdit(null)}
        />
      )}
    </div>
  );
};

export default FormularioEnfermera;