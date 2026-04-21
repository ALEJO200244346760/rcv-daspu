import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Circuito() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Nuevo estado para controlar el Modal
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const apiBaseURL = 'https://rcv-daspu-production.up.railway.app';

  useEffect(() => {
    axios.get(`${apiBaseURL}/api/circuito/listar`)
      .then(res => {
        setPacientes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener circuito:', err);
        setLoading(false);
      });
  }, []);

  const pacientesFiltrados = pacientes.filter(p =>
    p.patientInfo?.dni?.includes(busqueda)
  );

  // Función para cerrar el modal
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
            <div key={paciente.id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 flex flex-col justify-between">
              
              <div>
                {/* IDENTIDAD */}
                <div className="border-b pb-3 mb-3">
                  <div className="font-bold text-xl text-blue-900 uppercase">
                    {info.nombreApellido || 'Sin Nombre'}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span><b>DNI:</b> {info.dni}</span>
                    <span><b>Sexo:</b> {info.sexo}</span>
                  </div>
                </div>

                {/* EXAMEN FÍSICO */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-blue-50 p-3 rounded-lg">
                  <div><b>TA:</b> {fisico.tensionArterial || '--'}</div>
                  <div><b>IMC:</b> {fisico.imc?.toFixed(1) || '--'}</div>
                  <div><b>Peso:</b> {fisico.peso} kg</div>
                  <div><b>Talla:</b> {fisico.talla} m</div>
                </div>

                {/* LABORATORIO (Resumen) */}
                <div className="text-sm mb-4">
                  <h3 className="font-bold text-gray-700 mb-1 border-b text-xs uppercase">Laboratorio</h3>
                  <div className="grid grid-cols-2 gap-x-4">
                      <div className="flex justify-between"><span>Glucemia:</span> <b>{lab.glucemia || '--'}</b></div>
                      <div className="flex justify-between"><span>Col. Total:</span> <b>{lab.colesterolTotal || '--'}</b></div>
                      <div className="flex justify-between"><span>HDL:</span> <b>{lab.hdl || '--'}</b></div>
                      <div className="flex justify-between"><span>LDL:</span> <b>{lab.ldl || '--'}</b></div>
                  </div>
                </div>

                {/* ETIQUETAS ANTECEDENTES */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {antecedentes.diabetes && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">DIABETES</span>}
                  {antecedentes.hipertension && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">HTA</span>}
                  {paciente.asistio && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">ASISTIÓ</span>}
                </div>
              </div>

              {/* BOTÓN DETALLES - AHORA ABRE EL MODAL */}
              <button 
                onClick={() => setPacienteSeleccionado(paciente)}
                className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-black transition-colors"
              >
                Ver Historia Completa
              </button>
            </div>
          );
        })}
      </div>

      {pacientesFiltrados.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-500">
          No se encontraron pacientes con ese DNI.
        </div>
      )}

      {/* ==========================================
          MODAL DE HISTORIA CLÍNICA COMPLETA
          ========================================== */}
      {pacienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            
            {/* BOTÓN CERRAR */}
            <button 
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>

            {/* CABECERA MODAL */}
            <div className="bg-blue-900 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold uppercase">{pacienteSeleccionado.patientInfo?.nombreApellido}</h2>
              <div className="flex gap-4 mt-2 text-blue-200 text-sm">
                <span>DNI: {pacienteSeleccionado.patientInfo?.dni}</span>
                <span>Nacimiento: {pacienteSeleccionado.patientInfo?.fechaNacimiento}</span>
                <span>Tel: {pacienteSeleccionado.patientInfo?.telefono}</span>
                <span>Fecha Consulta: {pacienteSeleccionado.fechaConsulta}</span>
              </div>
            </div>

            {/* CONTENIDO MODAL */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* COLUMNA IZQUIERDA */}
              <div className="space-y-6">
                
                {/* Antecedentes Personales */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-3 border-b pb-1">Antecedentes Personales</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>HTA: <b>{pacienteSeleccionado.antecedentesPersonales?.hipertension ? 'Sí' : 'No'}</b></p>
                    <p>Diabetes: <b>{pacienteSeleccionado.antecedentesPersonales?.diabetes ? 'Sí' : 'No'}</b></p>
                    <p>Dislipidemia: <b>{pacienteSeleccionado.antecedentesPersonales?.dislipidemia ? 'Sí' : 'No'}</b></p>
                    <p>EPOC: <b>{pacienteSeleccionado.antecedentesPersonales?.epoc ? 'Sí' : 'No'}</b></p>
                    <p>ECV: <b>{pacienteSeleccionado.antecedentesPersonales?.ecv ? 'Sí' : 'No'}</b></p>
                    <p>Cáncer: <b>{pacienteSeleccionado.antecedentesPersonales?.cancer ? 'Sí' : 'No'}</b></p>
                  </div>
                </div>

                {/* Antecedentes Familiares */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-3 border-b pb-1">Antecedentes Familiares</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>HTA: <b>{pacienteSeleccionado.antecedentesFamiliares?.afHipertension ? 'Sí' : 'No'}</b></p>
                    <p>Diabetes: <b>{pacienteSeleccionado.antecedentesFamiliares?.afDiabetes ? 'Sí' : 'No'}</b></p>
                    <p>Cardiopatía: <b>{pacienteSeleccionado.antecedentesFamiliares?.afCardiopatia ? 'Sí' : 'No'}</b></p>
                    <p>Cáncer: <b>{pacienteSeleccionado.antecedentesFamiliares?.afCancer ? 'Sí' : 'No'}</b></p>
                  </div>
                  {pacienteSeleccionado.antecedentesFamiliares?.afCodigos && (
                     <p className="mt-2 text-xs text-gray-600">Códigos AF: {pacienteSeleccionado.antecedentesFamiliares.afCodigos}</p>
                  )}
                </div>

                {/* Examen Físico Detallado */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-3 border-b pb-1">Examen Físico</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>Peso: <b>{pacienteSeleccionado.examenFisico?.peso} kg</b></p>
                    <p>Talla: <b>{pacienteSeleccionado.examenFisico?.talla} m</b></p>
                    <p>C. Abdominal: <b>{pacienteSeleccionado.examenFisico?.contornoAbdominal} cm</b></p>
                    <p>Tensión Art.: <b>{pacienteSeleccionado.examenFisico?.tensionArterial}</b></p>
                    <p>Frec. Cardíaca: <b>{pacienteSeleccionado.examenFisico?.frecuenciaCardiaca} bpm</b></p>
                    <p>IMC: <b>{pacienteSeleccionado.examenFisico?.imc}</b></p>
                  </div>
                </div>

              </div>

              {/* COLUMNA DERECHA */}
              <div className="space-y-6">
                
                {/* Laboratorio Completo */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-3 border-b pb-1">Laboratorio Completo</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="flex justify-between"><span>Glucemia:</span> <b>{pacienteSeleccionado.laboratorio?.glucemia}</b></p>
                    <p className="flex justify-between"><span>Creatinina:</span> <b>{pacienteSeleccionado.laboratorio?.creatinina}</b></p>
                    <p className="flex justify-between"><span>Col. Total:</span> <b>{pacienteSeleccionado.laboratorio?.colesterolTotal}</b></p>
                    <p className="flex justify-between"><span>HDL:</span> <b>{pacienteSeleccionado.laboratorio?.hdl}</b></p>
                    <p className="flex justify-between"><span>LDL:</span> <b>{pacienteSeleccionado.laboratorio?.ldl}</b></p>
                    <p className="flex justify-between"><span>Triglicéridos:</span> <b>{pacienteSeleccionado.laboratorio?.trigliceridos}</b></p>
                    <p className="flex justify-between"><span>Hemoglobina:</span> <b>{pacienteSeleccionado.laboratorio?.hemoglobina}</b></p>
                    <p className="flex justify-between"><span>Leucocitos:</span> <b>{pacienteSeleccionado.laboratorio?.leucocitos}</b></p>
                    <p className="flex justify-between"><span>Sodio:</span> <b>{pacienteSeleccionado.laboratorio?.sodio}</b></p>
                    <p className="flex justify-between"><span>Potasio:</span> <b>{pacienteSeleccionado.laboratorio?.potasio}</b></p>
                  </div>
                </div>

                {/* Examen de Orina */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-3 border-b pb-1">Examen de Orina</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="flex justify-between"><span>pH:</span> <b>{pacienteSeleccionado.orina?.ph}</b></p>
                    <p className="flex justify-between"><span>Densidad:</span> <b>{pacienteSeleccionado.orina?.densidad}</b></p>
                    <p className="flex justify-between"><span>Proteinuria:</span> <b>{pacienteSeleccionado.orina?.proteinuria}</b></p>
                    <p className="flex justify-between"><span>Aspecto:</span> <b>{pacienteSeleccionado.orina?.aspecto || '--'}</b></p>
                  </div>
                </div>

                {/* Evaluación y Medicación */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Riesgo y Observaciones</h3>
                  <p className="text-sm mb-2">Nivel RCV: <b>{pacienteSeleccionado.evaluacion?.rcvNivel || 'No evaluado'}</b></p>
                  
                  {pacienteSeleccionado.medicacionActual?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold mb-1">Medicación Actual:</p>
                      <ul className="list-disc pl-5 text-xs">
                        {pacienteSeleccionado.medicacionActual.map((med, idx) => (
                          <li key={idx}>{med.descripcion} - {med.dosis} ({med.posologia})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Circuito;