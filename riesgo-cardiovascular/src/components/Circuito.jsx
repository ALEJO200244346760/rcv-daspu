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
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      try {
        await axios.delete(`${apiBaseURL}/api/circuito/eliminar/${id}`);
        setPacientes(pacientes.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el paciente.');
      }
    }
  };

  const irAFormularioRCV = (paciente) => {
    navigate('/', { state: { pacienteSeleccionado: paciente } });
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.patientInfo?.dni?.includes(busqueda)
  );

  const cerrarModal = () => setPacienteSeleccionado(null);

  const InfoRow = ({ label, value, unit = "" }) => (
    <div className="flex justify-between border-b border-gray-100 py-1">
      <span className="text-gray-500">{label}:</span>
      <span className="font-bold text-gray-800">{value !== null && value !== undefined ? `${value} ${unit}` : '--'}</span>
    </div>
  );

  if (loading) return <p className="p-4 text-center">Cargando datos del circuito...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 relative font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Circuito de Pacientes</h1>
        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
          Total: {pacientesFiltrados.length}
        </span>
      </div>

      {/* BUSCADOR */}
      <div className="relative mb-8 shadow-sm">
        <input
          type="text"
          placeholder="Buscar por DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
        <span className="absolute left-4 top-4 text-gray-400 text-xl">🔍</span>
      </div>

      {/* GRID TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientesFiltrados.map(paciente => (
          <div key={paciente.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col hover:shadow-2xl transition-all relative group">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-black text-lg text-blue-900 uppercase leading-tight truncate w-4/5">
                  {paciente.patientInfo?.nombreApellido || 'Sin Nombre'}
                </h2>
                {paciente.asistio && <span className="text-green-500 text-xl" title="Asistió">✔</span>}
              </div>
              <p className="text-sm text-gray-500 font-medium">DNI: {paciente.patientInfo?.dni}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-4 grid grid-cols-2 gap-y-1 text-xs">
              <p>TA: <span className="font-bold">{paciente.examenFisico?.tensionArterial || '--'}</span></p>
              <p>IMC: <span className="font-bold">{paciente.examenFisico?.imc?.toFixed(1) || '--'}</span></p>
              <p>Glucemia: <span className="font-bold">{paciente.laboratorio?.glucemia || '--'}</span></p>
              <p>Col. Total: <span className="font-bold">{paciente.laboratorio?.colesterolTotal || '--'}</span></p>
            </div>

            <div className="flex gap-2 mb-6">
              <button onClick={() => eliminarPaciente(paciente.id)} className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <button onClick={() => setPacienteSeleccionado(paciente)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-200">Detalles</button>
              <button onClick={() => irAFormularioRCV(paciente)} className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 shadow-md">Calcular RCV</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL GIGANTE - FICHA CLÍNICA COMPLETA */}
      {pacienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            
            {/* Header Modal */}
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight">{pacienteSeleccionado.patientInfo?.nombreApellido}</h2>
                <div className="flex gap-4 mt-1 text-blue-200 text-sm italic">
                  <span>DNI: {pacienteSeleccionado.patientInfo?.dni}</span>
                  <span>|</span>
                  <span>F.Nac: {pacienteSeleccionado.patientInfo?.fechaNacimiento}</span>
                  <span>|</span>
                  <span>Sexo: {pacienteSeleccionado.patientInfo?.sexo}</span>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-4xl font-light hover:text-red-400 transition-colors">&times;</button>
            </div>

            <div className="overflow-y-auto p-6 bg-gray-50 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* COLUMNA 1: CLÍNICA Y ANTECEDENTES */}
                <div className="space-y-6">
                  <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-blue-700 font-black text-xs uppercase mb-3 tracking-widest border-b pb-1">Examen Físico</h3>
                    <div className="text-sm space-y-1">
                      <InfoRow label="Peso" value={pacienteSeleccionado.examenFisico?.peso} unit="kg" />
                      <InfoRow label="Talla" value={pacienteSeleccionado.examenFisico?.talla} unit="m" />
                      <InfoRow label="IMC" value={pacienteSeleccionado.examenFisico?.imc?.toFixed(2)} />
                      <InfoRow label="Contorno Abd." value={pacienteSeleccionado.examenFisico?.contornoAbdominal} unit="cm" />
                      <InfoRow label="Tensión Art." value={pacienteSeleccionado.examenFisico?.tensionArterial} />
                      <InfoRow label="Frec. Cardíaca" value={pacienteSeleccionado.examenFisico?.frecuenciaCardiaca} unit="bpm" />
                    </div>
                  </section>

                  <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-blue-700 font-black text-xs uppercase mb-3 tracking-widest border-b pb-1">Antecedentes Personales</h3>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                      {Object.entries(pacienteSeleccionado.antecedentesPersonales || {}).map(([key, val]) => 
                        typeof val === 'boolean' && val && (
                          <span key={key} className="bg-red-50 text-red-700 px-2 py-1 rounded uppercase">{key}</span>
                        )
                      )}
                    </div>
                    {pacienteSeleccionado.antecedentesPersonales?.cancerTipoAnio && (
                       <p className="mt-3 text-xs p-2 bg-yellow-50 rounded border border-yellow-100"><b>Cáncer:</b> {pacienteSeleccionado.antecedentesPersonales.cancerTipoAnio}</p>
                    )}
                  </section>
                </div>

                {/* COLUMNA 2: LABORATORIO DETALLADO (HEMOGRAMA Y QUÍMICA) */}
                <div className="space-y-6 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h3 className="text-green-700 font-black text-xs uppercase mb-3 tracking-widest border-b pb-1">Hemograma Completo</h3>
                    <div className="text-xs space-y-1">
                      <InfoRow label="Eritrocitos" value={pacienteSeleccionado.laboratorio?.eritrocitos} />
                      <InfoRow label="Hemoglobina" value={pacienteSeleccionado.laboratorio?.hemoglobina} />
                      <InfoRow label="Hematocrito" value={pacienteSeleccionado.laboratorio?.hematocrito} />
                      <InfoRow label="VCM" value={pacienteSeleccionado.laboratorio?.vcm} />
                      <InfoRow label="Leucocitos" value={pacienteSeleccionado.laboratorio?.leucocitos} />
                      <InfoRow label="Neutrófilos Segm. %" value={pacienteSeleccionado.laboratorio?.neutrofilosSegm} />
                      <InfoRow label="Eosinófilos %" value={pacienteSeleccionado.laboratorio?.eosinofilos} />
                      <InfoRow label="Basófilos %" value={pacienteSeleccionado.laboratorio?.basofilos} />
                      <InfoRow label="Linfocitos %" value={pacienteSeleccionado.laboratorio?.linfocitos} />
                      <InfoRow label="Monocitos %" value={pacienteSeleccionado.laboratorio?.monocitos} />
                      <InfoRow label="Neutrófilos Abs." value={pacienteSeleccionado.laboratorio?.neutrofilosAbsoluto} />
                      <InfoRow label="Linfocitos Abs." value={pacienteSeleccionado.laboratorio?.linfocitosAbsoluto} />
                    </div>
                  </section>

                  <div className="space-y-6">
                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-purple-700 font-black text-xs uppercase mb-3 tracking-widest border-b pb-1">Química y Lípidos</h3>
                      <div className="text-xs space-y-1">
                        <InfoRow label="Glucemia" value={pacienteSeleccionado.laboratorio?.glucemia} unit="mg/dL" />
                        <InfoRow label="Creatinina" value={pacienteSeleccionado.laboratorio?.creatinina} />
                        <InfoRow label="TFG" value={pacienteSeleccionado.laboratorio?.filtradoGlomerular} />
                        <InfoRow label="Colesterol Total" value={pacienteSeleccionado.laboratorio?.colesterolTotal} />
                        <InfoRow label="HDL" value={pacienteSeleccionado.laboratorio?.hdl} />
                        <InfoRow label="LDL" value={pacienteSeleccionado.laboratorio?.ldl} />
                        <InfoRow label="Triglicéridos" value={pacienteSeleccionado.laboratorio?.trigliceridos} />
                      </div>
                    </section>

                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-orange-700 font-black text-xs uppercase mb-3 tracking-widest border-b pb-1">Orina y Electrolitos</h3>
                      <div className="text-xs space-y-1">
                        <InfoRow label="Sodio / Potasio" value={`${pacienteSeleccionado.laboratorio?.sodio || '--'} / ${pacienteSeleccionado.laboratorio?.potasio || '--'}`} />
                        <InfoRow label="Cloro" value={pacienteSeleccionado.laboratorio?.cloro} />
                        <InfoRow label="Proteinuria" value={pacienteSeleccionado.orina?.proteinuria} />
                        <InfoRow label="Rel. Prot/Crea" value={pacienteSeleccionado.orina?.relacionProteinaCreatinina} />
                        <InfoRow label="Densidad / pH" value={`${pacienteSeleccionado.orina?.densidad || '--'} / ${pacienteSeleccionado.orina?.ph || '--'}`} />
                        <InfoRow label="Aspecto" value={pacienteSeleccionado.orina?.aspecto} />
                        <InfoRow label="Nitritos" value={pacienteSeleccionado.orina?.nitritos} />
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* MEDICACIÓN Y RESULTADO FINAL */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-blue-900 p-5 rounded-2xl text-white shadow-xl flex flex-col justify-center items-center">
                    <span className="text-xs uppercase font-bold opacity-70">Nivel de Riesgo Cardiovascular</span>
                    <span className="text-4xl font-black mt-2 tracking-tighter">
                      {pacienteSeleccionado.evaluacionClinica?.rcvNivel || "PENDIENTE"}
                    </span>
                    {pacienteSeleccionado.evaluacionClinica?.alertasClinicas && (
                      <div className="mt-4 bg-white/10 p-3 rounded-lg text-xs italic border border-white/20">
                        ⚠️ {pacienteSeleccionado.evaluacionClinica.alertasClinicas}
                      </div>
                    )}
                 </div>

                 <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-400 font-black text-xs uppercase mb-3 tracking-widest border-b pb-1">Medicación Actual</h3>
                    {pacienteSeleccionado.medicacionActual?.length > 0 ? (
                      <ul className="space-y-2">
                        {pacienteSeleccionado.medicacionActual.map((m, i) => (
                          <li key={i} className="text-sm bg-gray-50 p-2 rounded-lg border-l-4 border-blue-500">
                            <span className="font-black text-blue-900">{m.descripcion}</span> - <span className="text-gray-600">{m.dosis} ({m.posologia})</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-gray-400 italic">No registra medicación.</p>}
                 </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-100 border-t flex justify-end">
                <button onClick={cerrarModal} className="bg-blue-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-black transition-colors">Cerrar Ficha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Circuito;