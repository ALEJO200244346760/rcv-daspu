import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Circuito() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

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

  const calcularEdad = (fecha) => {
    if (!fecha) return '';
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const filtrarPacientes = pacientes.filter(p => {
    const dni = p?.patientInfo?.document || '';
    return dni.includes(busqueda);
  });

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">

      {/* 🔎 BUSCADOR RÁPIDO */}
      <div className="mb-6 sticky top-0 bg-white p-2 z-10 shadow">
        <input
          type="text"
          placeholder="Buscar por DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">
        Circuito Clínico ({filtrarPacientes.length})
      </h1>

      {/* 🧾 TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

        {filtrarPacientes.map(paciente => {
          const info = paciente.patientInfo || {};
          const history = paciente.clinicalHistory || {};
          const vitals = paciente.vitalsAndLabs || {};
          const attachments = paciente.attachments || [];

          return (
            <div key={paciente.id} className="bg-white shadow rounded p-3 border">

              {/* HEADER PACIENTE */}
              <div className="flex justify-between mb-1">
                <span className="font-bold">{info.name}</span>
                <span className="text-xs text-gray-500">ID {paciente.id}</span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                DNI: <b>{info.document}</b> | Edad: {calcularEdad(info.birthdate)} | {info.gender}
              </div>

              {/* SIGNOS VITALES */}
              <div className="text-sm">
                <div>TA: <b>{vitals.bloodPressure}</b></div>
                <div>Colesterol: <b>{vitals.totalCholesterol}</b></div>
                <div>Peso: <b>{vitals.weightKg} kg</b></div>
                <div>IMC Altura: <b>{vitals.heightCm} cm</b></div>
              </div>

              {/* HISTORIA CLINICA RAPIDA */}
              <div className="mt-2 text-xs flex flex-wrap gap-1">
                <span className={`px-2 py-1 rounded ${history.hypertensive ? 'bg-red-200' : 'bg-gray-100'}`}>
                  HTA: {history.hypertensive ? 'Sí' : 'No'}
                </span>

                <span className={`px-2 py-1 rounded ${history.diabetic ? 'bg-yellow-200' : 'bg-gray-100'}`}>
                  DM: {history.diabetic ? 'Sí' : 'No'}
                </span>

                <span className={`px-2 py-1 rounded ${history.smoker ? 'bg-orange-200' : 'bg-gray-100'}`}>
                  Fuma: {history.smoker ? 'Sí' : 'No'}
                </span>

                <span className={`px-2 py-1 rounded ${history.hasDyslipidemia ? 'bg-blue-200' : 'bg-gray-100'}`}>
                  Dislipidemia
                </span>
              </div>

              {/* 📎 ADJUNTOS (ECG / ECO DIRECTO) */}
              {attachments.length > 0 && (
                <div className="mt-3 border-t pt-2">
                  <div className="text-xs font-bold mb-1">Adjuntos</div>

                  <div className="flex flex-col gap-1">
                    {attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs hover:underline"
                      >
                        📄 {att.type} ({att.issueDate})
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Circuito;