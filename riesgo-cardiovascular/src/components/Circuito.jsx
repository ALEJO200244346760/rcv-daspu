import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Circuito() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Asegúrate de que esta URL sea la correcta de tu despliegue en Railway
  const apiBaseURL = 'https://rcv-daspu-production.up.railway.app';

  useEffect(() => {
    // Usamos el endpoint que definimos en el PacienteCircuitoController
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

  // 🔎 FILTRO POR DNI (Usando p.patientInfo.dni que es como está en Java)
  const pacientesFiltrados = pacientes.filter(p =>
    p.patientInfo?.dni?.includes(busqueda)
  );

  if (loading) return <p className="p-4 text-center">Cargando datos del circuito...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
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

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientesFiltrados.map(paciente => {
          // Mapeo directo a las clases @Embedded de Java
          const info = paciente.patientInfo || {};
          const fisico = paciente.examenFisico || {};
          const lab = paciente.laboratorio || {};
          const antecedentes = paciente.antecedentesPersonales || {};

          return (
            <div key={paciente.id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-xl transition-shadow">
              
              {/* IDENTIDAD */}
              <div className="border-b pb-3 mb-3">
                <div className="font-bold text-xl text-blue-900 uppercase">
                  {info.nombreApellido || 'Sin Nombre'}
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span><b>DNI:</b> {info.dni}</span>
                  <span><b>Sexo:</b> {info.sexo}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                   Nacido el: {info.fechaNacimiento}
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
                    <div className="flex justify-between"><span>Glucemia:</span> <b>{lab.glucemia}</b></div>
                    <div className="flex justify-between"><span>Col. Total:</span> <b>{lab.colesterolTotal}</b></div>
                    <div className="flex justify-between"><span>HDL:</span> <b>{lab.hdl}</b></div>
                    <div className="flex justify-between"><span>LDL:</span> <b>{lab.ldl}</b></div>
                </div>
              </div>

              {/* ANTECEDENTES */}
              <div className="flex gap-2 flex-wrap">
                {antecedentes.diabetes && (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">DIABETES</span>
                )}
                {antecedentes.hipertension && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">HTA</span>
                )}
                {paciente.asistio && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">ASISTIÓ</span>
                )}
              </div>

              {/* BOTÓN DETALLES (Opcional) */}
              <button className="w-full mt-4 bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-black transition-colors">
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
    </div>
  );
}

export default Circuito;