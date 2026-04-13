import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Circuito() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarDetalles, setMostrarDetalles] = useState({});

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

  const toggleDetalles = (id) => {
    setMostrarDetalles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Circuito de Pacientes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {pacientes.map(paciente => {

          const info = paciente.patientInfo || {};
          const history = paciente.clinicalHistory || {};
          const vitals = paciente.vitalsAndLabs || {};
          const attachments = paciente.attachments || [];

          return (
            <div key={paciente.id} className="bg-white shadow-md rounded-lg p-4 border">

              {/* =========================
                  👤 DATOS BÁSICOS
              ========================= */}
              <div className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Nombre:</span>
                  <span>{info.name}</span>
                </div>

                <div className="flex justify-between">
                  <span>DNI:</span>
                  <span>{info.document}</span>
                </div>

                <div className="flex justify-between">
                  <span>Edad:</span>
                  <span>{calcularEdad(info.birthdate)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Género:</span>
                  <span>{info.gender}</span>
                </div>

                <div className="flex justify-between">
                  <span>Teléfono:</span>
                  <span>{info.phone}</span>
                </div>
              </div>

              {/* =========================
                  ❤️ VITALES
              ========================= */}
              <div className="border-t pt-2 mb-2">
                <div className="flex justify-between">
                  <span>TA:</span>
                  <span>{vitals.bloodPressure}</span>
                </div>

                <div className="flex justify-between">
                  <span>Colesterol:</span>
                  <span>{vitals.totalCholesterol}</span>
                </div>

                <div className="flex justify-between">
                  <span>Peso:</span>
                  <span>{vitals.weightKg} kg</span>
                </div>

                <div className="flex justify-between">
                  <span>Altura:</span>
                  <span>{vitals.heightCm} cm</span>
                </div>

                <div className="flex justify-between">
                  <span>Cintura:</span>
                  <span>{vitals.waistCircumferenceCm} cm</span>
                </div>

                <div className="flex justify-between">
                  <span>TFG:</span>
                  <span>{vitals.estimatedGfr}</span>
                </div>
              </div>

              {/* =========================
                  🔘 BOTÓN DETALLES
              ========================= */}
              <button
                onClick={() => toggleDetalles(paciente.id)}
                className="text-indigo-600 hover:text-indigo-900 mt-2"
              >
                {mostrarDetalles[paciente.id] ? 'Ocultar historia' : 'Ver historia completa'}
              </button>

              {/* =========================
                  📋 HISTORIA COMPLETA
              ========================= */}
              {mostrarDetalles[paciente.id] && (
                <div className="mt-3 border-t pt-3 text-sm">

                  <h3 className="font-semibold mb-2">Historia Clínica</h3>

                  <div className="flex justify-between">
                    <span>Hipertenso:</span>
                    <span>{history.hypertensive ? 'Sí' : 'No'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Diabetes:</span>
                    <span>{history.diabetic ? 'Sí' : 'No'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Dislipidemia:</span>
                    <span>{history.hasDyslipidemia ? 'Sí' : 'No'}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Fumador:</span>
                    <span>{history.smoker ? 'Sí' : 'No'}</span>
                  </div>

                  {/* =========================
                      📎 ECG / ECO / ADJUNTOS
                  ========================= */}
                  {attachments.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-3 mb-2">Estudios</h3>

                      {attachments.map((att, i) => (
                        <div key={i} className="mb-2 p-2 bg-gray-50 rounded">

                          <div className="font-semibold text-xs">
                            {att.type}
                          </div>

                          <div className="text-xs text-gray-500">
                            {att.issueDate}
                          </div>

                          {/* 🔥 LINK DIRECTO PDF / ECO / ECG */}
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline"
                          >
                            Ver {att.type === 'Electrocardiogram' ? 'ECG' :
                                  att.type === 'Echocardiogram' ? 'ECO' : 'Archivo'}
                          </a>

                          {/* 🔥 PREVIEW VISUAL OPCIONAL */}
                          {att.fileUrl?.includes('.pdf') && (
                            <iframe
                              src={att.fileUrl}
                              className="w-full h-40 mt-2 border rounded"
                              title={att.type}
                            />
                          )}

                        </div>
                      ))}
                    </>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* =========================
          TOTAL
      ========================= */}
      <div className="mt-6 font-semibold">
        Total de pacientes: {pacientes.length}
      </div>
    </div>
  );
}

export default Circuito;