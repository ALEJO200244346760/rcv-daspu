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
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  // 🔎 FILTRO POR DNI (DOCUMENTO)
  const pacientesFiltrados = pacientes.filter(p =>
    p.patientInfo?.document?.includes(busqueda)
  );

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-4">Circuito de Pacientes</h1>

      {/* BUSCADOR DNI */}
      <input
        type="text"
        placeholder="Buscar por DNI..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full mb-6 p-2 border rounded shadow-sm"
      />

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {pacientesFiltrados.map(paciente => {

          const info = paciente.patientInfo || {};
          const history = paciente.clinicalHistory || {};
          const vitals = paciente.vitalsAndLabs || {};
          const attachments = paciente.attachments || [];

          return (
            <div key={paciente.id} className="bg-white shadow-md rounded-lg p-4 border">

              {/* IDENTIDAD */}
              <div className="font-bold text-lg mb-2">
                {info.name}
              </div>

              <div className="text-sm mb-1">
                <b>DNI:</b> {info.document}
              </div>

              <div className="text-sm mb-1">
                <b>Edad:</b> {calcularEdad(info.birthdate)}
              </div>

              <div className="text-sm mb-1">
                <b>Género:</b> {info.gender}
              </div>

              <div className="text-sm mb-2">
                <b>Tel:</b> {info.phone}
              </div>

              {/* VITALES */}
              <div className="bg-gray-50 p-2 rounded text-sm mb-2">
                <div><b>TA:</b> {vitals.bloodPressure}</div>
                <div><b>Col:</b> {vitals.totalCholesterol}</div>
                <div><b>Peso:</b> {vitals.weightKg} kg</div>
                <div><b>Altura:</b> {vitals.heightCm} cm</div>
                <div><b>Cintura:</b> {vitals.waistCircumferenceCm} cm</div>
                <div><b>TFG:</b> {vitals.estimatedGfr}</div>
              </div>

              {/* HISTORIA CLÍNICA */}
              <div className="text-sm mb-2">
                <div>🫀 HTA: {history.hypertensive ? 'Sí' : 'No'}</div>
                <div>🩸 Diabetes: {history.diabetic ? 'Sí' : 'No'}</div>
                <div>🧬 Dislipidemia: {history.hasDyslipidemia ? 'Sí' : 'No'}</div>
                <div>🚬 Fumador: {history.smoker ? 'Sí' : 'No'}</div>
              </div>

              {/* 📎 ADJUNTOS (ECG / ECO / PDF) */}
              <div className="mt-2">
                <div className="font-semibold text-sm mb-1">Adjuntos</div>

                {attachments.length === 0 ? (
                  <div className="text-xs text-gray-500">Sin estudios</div>
                ) : (
                  attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 text-sm hover:underline"
                    >
                      📄 {att.type} ({att.issueDate})
                    </a>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      <div className="mt-6 font-semibold">
        Total: {pacientesFiltrados.length}
      </div>
    </div>
  );
}

export default Circuito;