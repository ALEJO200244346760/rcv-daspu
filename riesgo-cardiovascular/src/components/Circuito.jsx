import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Circuito() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarDetalles, setMostrarDetalles] = useState({});
  const [archivoActivo, setArchivoActivo] = useState(null);

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

  // 📄 EXPORTAR PDF
  const exportarPDF = async (id) => {
    const input = document.getElementById(`paciente-${id}`);
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`paciente-${id}.pdf`);
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
            <div
              key={paciente.id}
              id={`paciente-${paciente.id}`}
              className="bg-white shadow-md rounded-lg p-4"
            >

              {/* 🧑 DATOS BÁSICOS */}
              <div className="flex justify-between mb-2">
                <span className="font-medium">Nombre:</span>
                <span>{info.name}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>DNI:</span>
                <span>{info.document}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Edad:</span>
                <span>{calcularEdad(info.birthdate)}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Género:</span>
                <span>{info.gender}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Teléfono:</span>
                <span>{info.phone}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>TA:</span>
                <span>{vitals.bloodPressure}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Colesterol:</span>
                <span>{vitals.totalCholesterol}</span>
              </div>

              {/* BOTONES */}
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => toggleDetalles(paciente.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {mostrarDetalles[paciente.id] ? 'Ocultar' : 'Ver más'}
                </button>

                <button
                  onClick={() => exportarPDF(paciente.id)}
                  className="text-green-600 hover:text-green-900"
                >
                  PDF
                </button>
              </div>

              {/* 🏥 HISTORIA CLÍNICA */}
              {mostrarDetalles[paciente.id] && (
                <div className="mt-4 border-t pt-3 text-sm">

                  <h2 className="font-bold text-lg mb-2">Historia Clínica</h2>

                  <p><strong>Paciente:</strong> {info.name}</p>
                  <p><strong>DNI:</strong> {info.document}</p>
                  <p><strong>Edad:</strong> {calcularEdad(info.birthdate)}</p>

                  <h3 className="font-semibold mt-3">Antecedentes</h3>
                  <p>Hipertensión: {history.hypertensive ? 'Sí' : 'No'}</p>
                  <p>Diabetes: {history.diabetic ? 'Sí' : 'No'}</p>
                  <p>Dislipidemia: {history.hasDyslipidemia ? 'Sí' : 'No'}</p>
                  <p>Tabaquismo: {history.smoker ? 'Sí' : 'No'}</p>

                  <h3 className="font-semibold mt-3">Examen Físico</h3>
                  <p>TA: {vitals.bloodPressure}</p>
                  <p>Peso: {vitals.weightKg} kg</p>
                  <p>Altura: {vitals.heightCm} cm</p>
                  <p>Cintura: {vitals.waistCircumferenceCm} cm</p>

                  <h3 className="font-semibold mt-3">Laboratorio</h3>
                  <p>Colesterol: {vitals.totalCholesterol}</p>
                  <p>TFG: {vitals.estimatedGfr}</p>

                  {/* 📎 ADJUNTOS */}
                  {attachments.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-3">Estudios</h3>

                      {attachments.map((att, i) => (
                        <div key={i} className="mb-2">
                          <p><strong>{att.type}</strong> - {att.issueDate}</p>

                          <button
                            onClick={() => setArchivoActivo(att.fileUrl)}
                            className="text-blue-600 hover:underline"
                          >
                            Ver estudio
                          </button>
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

      {/* 📊 TOTAL */}
      <div className="mt-6 font-semibold">
        Total: {pacientes.length}
      </div>

      {/* 🧾 MODAL VISOR */}
      {archivoActivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 h-5/6 p-4 relative rounded shadow-lg">

            <button
              onClick={() => setArchivoActivo(null)}
              className="absolute top-2 right-3 text-red-600 text-xl"
            >
              ✕
            </button>

            <iframe
              src={archivoActivo}
              title="Documento"
              className="w-full h-full border"
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default Circuito;