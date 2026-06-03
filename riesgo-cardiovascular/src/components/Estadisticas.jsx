import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EstadisticasGraficos from './EstadisticasGraficos';
import FiltrosEstadisticas from './estadisticas/FiltrosEstadisticas';
import TarjetaPaciente from './estadisticas/TarjetaPaciente';
import { apiBaseURL, aplicarFiltros, copiarDatos } from './estadisticas/estadisticasUtils';

// ─────────────────────────────────────────────────────────────
// ESTADO INICIAL DE FILTROS
// ─────────────────────────────────────────────────────────────
const FILTROS_INICIAL = {
  edad: '', cuil: '', genero: '', diabetes: '', fumador: '', exfumador: '',
  presionArterial: '', colesterol: '', nivelColesterol: '', nivelRiesgo: '',
  ubicacion: '', imc: '', infarto: '', acv: '', cintura: '', hipertenso: '',
  doctor: '', medicamentosHipertension: '', medicamentosDiabetes: '',
  medicamentosColesterol: '', aspirina: '', tfg: '', numeroGestas: '',
  fum: '', metodoAnticonceptivo: '', trastornosHipertensivos: '',
  diabetesGestacional: '', sop: '', enfermedad: '', alergias: '',
  tiroides: '', sedentarismo: '',
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
function Estadisticas() {
  const [pacientes, setPacientes]                 = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [filtros, setFiltros]                     = useState(FILTROS_INICIAL);
  const [nivelColesterolConocido, setNivelColesterolConocido] = useState('todos');
  const [busquedaCuil, setBusquedaCuil]           = useState('');
  const [loading, setLoading]                     = useState(true);
  const [mostrarDetalles, setMostrarDetalles]     = useState({});
  const [mostrarGraficos, setMostrarGraficos]     = useState(false);
  const [mostrarFiltros, setMostrarFiltros]       = useState(false);

  // Datos auxiliares para el botón copiar
  const [datosCircuitoTotales, setDatosCircuitoTotales] = useState([]);
  const [datosEnfermeriaTotales, setDatosEnfermeriaTotales] = useState([]);

  const navigate = useNavigate();

  // ── Carga inicial ────────────────────────────────────────
  useEffect(() => {
    axios.get(`${apiBaseURL}/api/pacientes`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setPacientes(data);
        setPacientesFiltrados(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get(`${apiBaseURL}/api/circuito/listar`)
      .then(res => setDatosCircuitoTotales(res.data))
      .catch(err => console.error('Error circuito:', err));
  }, []);

  // Cargar datos de enfermería para el botón copiar
  useEffect(() => {
    axios.get(`${apiBaseURL}/api/estudios/todos`)
      .then(res => setDatosEnfermeriaTotales(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error enfermería:', err));
  }, []);

  // ── Filtros reactivos ────────────────────────────────────
  useEffect(() => {
    setPacientesFiltrados(
      aplicarFiltros(pacientes, filtros, nivelColesterolConocido, busquedaCuil)
    );
  }, [filtros, nivelColesterolConocido, busquedaCuil, pacientes]);

  // ── Handlers ─────────────────────────────────────────────
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value || '' }));
  };

  const manejarSeleccionColesterol = (e) => {
    const valor = e.target.value;
    setNivelColesterolConocido(valor);
    if (valor === 'no') setFiltros(prev => ({ ...prev, nivelColesterol: '' }));
  };

  const toggleDetalles = (id) =>
    setMostrarDetalles(prev => ({ ...prev, [id]: !prev[id] }));

  const eliminarPaciente = (id) => {
    axios.delete(`${apiBaseURL}/api/pacientes/${id}`)
      .then(() => {
        setPacientes(prev => prev.filter(p => p.id !== id));
        setPacientesFiltrados(prev => prev.filter(p => p.id !== id));
      })
      .catch(err => console.error('Error al eliminar:', err));
  };

  if (loading) return <p className="p-4">Cargando...</p>;

  // ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de Pacientes</h1>

      {/* Buscador por CUIL */}
      <div className="mb-4 flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
        <span className="text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar por CUIL..."
          value={busquedaCuil}
          onChange={e => setBusquedaCuil(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <button onClick={() => setMostrarFiltros(p => !p)}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md shadow hover:bg-gray-300">
          {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        {mostrarFiltros && (
          <FiltrosEstadisticas
            filtros={filtros}
            nivelColesterolConocido={nivelColesterolConocido}
            onChange={manejarCambio}
            onColesterolChange={manejarSeleccionColesterol}
            onAplicar={() => setPacientesFiltrados(
              aplicarFiltros(pacientes, filtros, nivelColesterolConocido, busquedaCuil)
            )}
          />
        )}
      </div>

      {/* Gráficos */}
      <button onClick={() => setMostrarGraficos(p => !p)}
        className="bg-indigo-600 text-white p-2 rounded mb-4">
        {mostrarGraficos ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
      </button>
      {mostrarGraficos && (
        <div className="mt-4">
          <EstadisticasGraficos pacientesFiltrados={pacientesFiltrados} />
        </div>
      )}

      <div className="mt-4 mb-4">
        <h2 className="text-xl font-semibold">
          Total coinciden con filtros: {pacientesFiltrados.length}
        </h2>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...pacientesFiltrados].reverse().map(paciente => (
          <TarjetaPaciente
            key={paciente.id}
            paciente={paciente}
            mostrarDetalle={!!mostrarDetalles[paciente.id]}
            onToggleDetalle={() => toggleDetalles(paciente.id)}
            onEditar={() => navigate(`/editar-paciente/${paciente.id}`)}
            onEliminar={() => eliminarPaciente(paciente.id)}
            onCopiar={() => copiarDatos(paciente, datosCircuitoTotales, datosEnfermeriaTotales)}
          />
        ))}
      </div>
    </div>
  );
}

export default Estadisticas;