import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Circuito() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const navigate = useNavigate();
  const apiBaseURL = 'https://rcv-daspu-production.up.railway.app';

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = () => {
    setLoading(true);
    axios.get(`${apiBaseURL}/api/circuito/listar`)
      .then(res => {
        setPacientes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener circuito:', err);
        setLoading(false);
      });
  };

  const eliminarPaciente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente del circuito?')) {
      try {
        await axios.delete(`${apiBaseURL}/api/circuito/eliminar/${id}`);
        // Actualizamos la lista localmente para no recargar toda la página
        setPacientes(pacientes.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar el paciente.');
      }
    }
  };

  const irAFormularioRCV = (paciente) => {
    navigate('/', { state: { pacienteSeleccionado: paciente } });
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.patientInfo?.dni?.includes(busqueda)
  );

  const cerrarModal = () => {
    setPacienteSeleccionado(null);
  };

  if (loading) return <p className="p-4 text-center">Cargando datos del circuito...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Circuito de Pacientes</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          Total: {pacientesFiltrados.length}
        </span>
      </div>

      {/* BUSCADOR DNI */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Buscar por DNI del paciente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
      </div>

      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientesFiltrados.map(paciente => {
          const info = paciente.patientInfo || {};
          const fisico = paciente.examenFisico || {};
          const lab = paciente.laboratorio || {};
          const antecedentes = paciente.antecedentesPersonales || {};

          return (
            <div key={paciente.id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden">
              
              <div>
                {/* IDENTIDAD */}
                <div className="border-b pb-3 mb-3">
                  <div className="font-bold text-xl text-blue-900 uppercase truncate">
                    {info.nombreApellido || 'Sin Nombre'}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span><b>DNI:</b> {info.dni}</span>
                    <span><b>Sexo:</b> {info.sexo}</span>
                  </div>
                </div>

                {/* EXAMEN FÍSICO RÁPIDO */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-blue-50 p-3 rounded-lg">
                  <div><b>TA:</b> {fisico.tensionArterial || '--'}</div>
                  <div><b>IMC:</b> {fisico.imc?.toFixed(1) || '--'}</div>
                  <div><b>Peso:</b> {fisico.peso} kg</div>
                  <div><b>Talla:</b> {fisico.talla} m</div>
                </div>

                {/* RESUMEN LAB */}
                <div className="text-sm mb-4">
                  <h3 className="font-bold text-gray-700 mb-1 border-b text-xs uppercase text-center">Laboratorio</h3>
                  <div className="grid grid-cols-2 gap-x-4">
                      <div className="flex justify-between"><span>Gluc.:</span> <b>{lab.glucemia || '--'}</b></div>
                      <div className="flex justify-between"><span>Col.T:</span> <b>{lab.colesterolTotal || '--'}</b></div>
                      <div className="flex justify-between"><span>HDL:</span> <b>{lab.hdl || '--'}</b></div>
                      <div className="flex justify-between"><span>LDL:</span> <b>{lab.ldl || '--'}</b></div>
                  </div>
                </div>

                {/* BADGES */}
                <div className="flex gap-2 flex-wrap mb-4 justify-center">
                  {antecedentes.diabetes && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">DIABETES</span>}
                  {antecedentes.hipertension && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">HTA</span>}
                  {paciente.asistio && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">ASISTIÓ</span>}
                </div>
              </div>

              {/* ACCIONES */}
              <div className="flex gap-2 items-center">
                {/* BOTÓN ELIMINAR IZQUIERDA ABAJO */}
                <button 
                  onClick={() => eliminarPaciente(paciente.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all border border-red-100"
                  title="Eliminar Paciente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <button 
                  onClick={() => setPacienteSeleccionado(paciente)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Detalles
                </button>
                <button 
                  onClick={() => irAFormularioRCV(paciente)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-bold hover:bg-blue-700 shadow-md transition-colors"
                >
                  Calcular RCV
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pacientesFiltrados.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-500">
          No se encontraron pacientes con ese DNI.
        </div>
      )}

      {/* MODAL DETALLADO COMPLETO */}
      {pacienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-3xl font-bold z-10"
            >
              &times;
            </button>

            <div className="bg-blue-900 text-white p-6 sticky top-0 shadow-lg">
              <h2 className="text-2xl font-bold uppercase">{pacienteSeleccionado.patientInfo?.nombreApellido}</h2>
              <div className="flex gap-4 mt-2 text-blue-100 text-sm flex-wrap">
                <span>DNI: {pacienteSeleccionado.patientInfo?.dni}</span>
                <span>Nacimiento: {pacienteSeleccionado.patientInfo?.fechaNacimiento}</span>
                <span>Tel: {pacienteSeleccionado.patientInfo?.telefono}</span>
                <span>Origen: {pacienteSeleccionado.origenTurno}</span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* SECCIÓN 1: ANTECEDENTES PERSONALES Y FAMILIARES */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-blue-800 mb-3 border-b pb-1 uppercase text-xs">A. Personales</h3>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    <p className="flex justify-between">HTA: <b>{pacienteSeleccionado.antecedentesPersonales?.hipertension ? 'SI' : 'NO'}</b></p>
                    <p className="flex justify-between">Diabetes: <b>{pacienteSeleccionado.antecedentesPersonales?.diabetes ? 'SI' : 'NO'}</b></p>
                    <p className="flex justify-between">Dislipidemia: <b>{pacienteSeleccionado.antecedentesPersonales?.dislipidemia ? 'SI' : 'NO'}</b></p>
                    <p className="flex justify-between">ECV: <b>{pacienteSeleccionado.antecedentesPersonales?.ecv ? 'SI' : 'NO'}</b></p>
                    <p className="flex justify-between">Cáncer: <b>{pacienteSeleccionado.antecedentesPersonales?.cancer ? 'SI' : 'NO'}</b></p>
                    {pacienteSeleccionado.antecedentesPersonales?.cancerTipoAnio && (
                      <p className="mt-1 text-xs text-red-600 bg-red-50 p-1 px-2 rounded">Tipo/Año: {pacienteSeleccionado.antecedentesPersonales.cancerTipoAnio}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-blue-800 mb-3 border-b pb-1 uppercase text-xs">A. Familiares</h3>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    <p className="flex justify-between">Diabetes AF: <b>{pacienteSeleccionado.antecedentesFamiliares?.afDiabetes ? 'SI' : 'NO'}</b></p>
                    <p className="flex justify-between">HTA AF: <b>{pacienteSeleccionado.antecedentesFamiliares?.afHipertension ? 'SI' : 'NO'}</b></p>
                    <p className="flex justify-between">Cardiopatía AF: <b>{pacienteSeleccionado.antecedentesFamiliares?.afCardiopatia ? 'SI' : 'NO'}</b></p>
                    <p className="flex justify-between">ACV AF: <b>{pacienteSeleccionado.antecedentesFamiliares?.afAcv ? 'SI' : 'NO'}</b></p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: EXAMEN FÍSICO Y ORINA */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-blue-800 mb-3 border-b pb-1 uppercase text-xs">Examen Físico</h3>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    <p className="flex justify-between">Peso: <b>{pacienteSeleccionado.examenFisico?.peso} kg</b></p>
                    <p className="flex justify-between">Talla: <b>{pacienteSeleccionado.examenFisico?.talla} m</b></p>
                    <p className="flex justify-between">IMC: <b>{pacienteSeleccionado.examenFisico?.imc?.toFixed(2)}</b></p>
                    <p className="flex justify-between">C. Abd: <b>{pacienteSeleccionado.examenFisico?.contornoAbdominal} cm</b></p>
                    <p className="flex justify-between">TA: <b className="text-blue-700">{pacienteSeleccionado.examenFisico?.tensionArterial}</b></p>
                    <p className="flex justify-between">FC: <b>{pacienteSeleccionado.examenFisico?.frecuenciaCardiaca} lpm</b></p>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-bold text-orange-800 mb-3 border-b border-orange-200 pb-1 uppercase text-xs">Examen Orina</h3>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    <p className="flex justify-between">Color: <b>{pacienteSeleccionado.orina?.color || '--'}</b></p>
                    <p className="flex justify-between">Aspecto: <b>{pacienteSeleccionado.orina?.aspecto || '--'}</b></p>
                    <p className="flex justify-between">Albuminuria: <b>{pacienteSeleccionado.antecedentesPersonales?.albuminuria || '--'}</b></p>
                    <p className="flex justify-between">Rel. Prot/Crea: <b>{pacienteSeleccionado.orina?.relacionProteinaCreatinina || '--'}</b></p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: LABORATORIO DETALLADO Y RCV */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-blue-800 mb-3 border-b pb-1 uppercase text-xs">Laboratorio</h3>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    <p className="flex justify-between">Glucemia: <b>{pacienteSeleccionado.laboratorio?.glucemia}</b></p>
                    <p className="flex justify-between">Creatinina: <b>{pacienteSeleccionado.laboratorio?.creatinina}</b></p>
                    <p className="flex justify-between">TFG (Filtrado): <b>{pacienteSeleccionado.laboratorio?.filtradoGlomerular}</b></p>
                    <p className="flex justify-between">Col. Total: <b>{pacienteSeleccionado.laboratorio?.colesterolTotal}</b></p>
                    <p className="flex justify-between">HDL: <b>{pacienteSeleccionado.laboratorio?.hdl}</b></p>
                    <p className="flex justify-between">LDL: <b>{pacienteSeleccionado.laboratorio?.ldl}</b></p>
                    <p className="flex justify-between">Triglicéridos: <b>{pacienteSeleccionado.laboratorio?.trigliceridos}</b></p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2 border-b border-red-200 pb-1 uppercase text-xs">Resultado RCV</h3>
                  <p className="text-lg text-center font-black text-red-600 bg-white border border-red-200 rounded py-2 mt-2">
                    {pacienteSeleccionado.evaluacionClinica?.rcvNivel || 'SIN EVALUAR'}
                  </p>
                  {pacienteSeleccionado.evaluacionClinica?.alertasClinicas && (
                    <div className="text-xs mt-3 text-red-700 font-bold p-2 bg-white rounded-md shadow-sm">
                      ⚠ {pacienteSeleccionado.evaluacionClinica.alertasClinicas}
                    </div>
                  )}
                </div>
              </div>

              {/* SECCIÓN MEDICACIÓN (FULL WIDTH) */}
              {pacienteSeleccionado.medicacionActual?.length > 0 && (
                <div className="col-span-full bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-3 border-b pb-1 uppercase text-xs">Medicación Actual</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pacienteSeleccionado.medicacionActual.map((med, idx) => (
                      <div key={idx} className="bg-white p-2 rounded shadow-sm text-sm border-l-4 border-blue-500">
                        <b>{med.descripcion}</b> <span className="text-gray-500">|</span> {med.dosis} <span className="text-gray-500">|</span> {med.posologia}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Circuito;