import React from 'react';
import { obtenerColorRiesgo } from './Enfermerautils';
import { Fila, EstudioImagen } from './Enfermeraui';

// ─────────────────────────────────────────────────────────────
// MODAL DETALLE COMPLETO DEL PACIENTE
// ─────────────────────────────────────────────────────────────
const ModalDetallePaciente = ({ est, onClose }) => {
  let eventosCvObj = {};
  try { eventosCvObj = JSON.parse(est.eventosCv || '{}'); } catch {}
  const eventosActivos = Object.entries(eventosCvObj).filter(([, v]) => v).map(([k]) => k);

  const estudios = [
    { link: est.linkElectrocardiograma, label: 'Electrocardiograma', color: 'bg-rose-500 hover:bg-rose-600' },
    { link: est.linkEcocardiograma,     label: 'Ecocardiograma',     color: 'bg-blue-500 hover:bg-blue-600' },
    { link: est.linkLaboratorio,        label: 'Laboratorio',        color: 'bg-green-500 hover:bg-green-600' },
    { link: est.linkOtroEstudio, label: est.nombreOtroEstudio || 'Otro estudio', color: 'bg-purple-500 hover:bg-purple-600' },
  ].filter(e => e.link);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header fijo */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Ficha del paciente</h3>
            <p className="text-sm text-gray-500">
              DNI: <strong>{est.dni}</strong>
              {est.genero && ` — ${est.genero}`}
              {est.edad && ` — ${est.edad} años`}
            </p>
          </div>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            ✕
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Badges resumen */}
          <div className="flex flex-wrap gap-2">
            {est.nivelRiesgo && (
              <span className={`px-3 py-1 text-sm font-bold rounded-full ${obtenerColorRiesgo(est.nivelRiesgo)}`}>
                Riesgo: {est.nivelRiesgo}
              </span>
            )}
            {est.imc && (
              <span className="px-3 py-1 text-sm font-bold rounded-full bg-indigo-100 text-indigo-800">
                IMC: {est.imc} ({est.imcClasificacion})
              </span>
            )}
            {est.fechaCarga && (
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-500">
                {new Date(est.fechaCarga).toLocaleDateString('es-AR')}
              </span>
            )}
          </div>

          {/* 1. Datos filiatorios */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">1. Datos filiatorios</p>
            <Fila label="Fecha de nacimiento" value={est.fechaNacimiento} />
            <Fila label="Teléfono" value={est.telefono} />
            {est.genero === 'femenino' && <>
              <Fila label="Tuvo hijos" value={est.tuvoHijos} />
              <Fila label="Complicaciones embarazo" value={est.complicacionesEmbarazo} />
            </>}
          </section>

          {/* 2. Eventos CV */}
          {eventosActivos.length > 0 && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">2. Eventos cardiovasculares</p>
              <div className="flex flex-wrap gap-1">
                {eventosActivos.map(ev => (
                  <span key={ev} className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">{ev}</span>
                ))}
              </div>
            </section>
          )}

          {/* 3. Factores de riesgo */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">3. Factores de riesgo / Medicación</p>
            <Fila label="Toma medicación" value={est.tomaMedicacion} />
            <Fila label="Hipertensión" value={est.hipertension} />
            <Fila label="Medicamentos HTA" value={est.medsHipertension} />
            <Fila label="Otro med. HTA" value={est.otroMedHipertension} />
            <Fila label="Diabetes" value={est.diabetes} />
            <Fila label="Medicamentos diabetes" value={est.medsDiabetes} />
            <Fila label="Otro med. diabetes" value={est.otroMedDiabetes} />
            <Fila label="Colesterol elevado" value={est.colesterol} />
            <Fila label="Medicamentos colesterol" value={est.medsColesterol} />
            <Fila label="Otro med. colesterol" value={est.otroMedColesterol} />
            <Fila label="Estrés / Ansiedad" value={est.estresAnsiedad} />
            <Fila label="Detalle estrés" value={est.estresDetalle} />
            <Fila label="Otras patologías" value={est.otrasPatologias} />
            <Fila label="Detalle patologías" value={est.otrasPatologiasDetalle} />
          </section>

          {/* 4. Hábitos */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">4. Hábitos</p>
            <Fila label="Fuma" value={est.fuma} />
            <Fila label="Fumó en el pasado" value={est.fumoPorMucho} />
            <Fila label="Consume alcohol" value={est.consumeAlcohol} />
            <Fila label="Duerme 6-8 hs" value={est.duerme68} />
            <Fila label="Actividad física" value={est.actividadFisica} />
          </section>

          {/* 5. Síntomas */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">5. Síntomas de alarma</p>
            <Fila label="Síntomas" value={est.sintomas} />
            <Fila label="Otro síntoma" value={est.sintomaOtro} />
          </section>

          {/* 6. Datos antropométricos */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">6. Datos antropométricos</p>
            <Fila label="Peso" value={est.peso ? `${est.peso} kg` : null} />
            <Fila label="Talla" value={est.talla ? `${est.talla} cm` : null} />
            <Fila label="Cintura" value={est.cintura ? `${est.cintura} cm` : null} />
            <Fila label="TA Máxima" value={est.tensionSistolica ? `${est.tensionSistolica} mmHg` : null} />
            <Fila label="TA Mínima" value={est.tensionDiastolica ? `${est.tensionDiastolica} mmHg` : null} />
          </section>

          {/* 7. Estudios complementarios */}
          {estudios.length > 0 && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">7. Estudios complementarios</p>

              {/* Botones para abrir en nueva pestaña */}
              <div className="flex flex-wrap gap-2 mb-4">
                {estudios.map(({ link, label, color }) => (
                  <a key={label} href={link} target="_blank" rel="noopener noreferrer"
                    className={`px-4 py-2 ${color} text-white text-sm font-semibold rounded-lg transition-colors`}>
                    {label === 'Electrocardiograma' && '❤️ '}
                    {label === 'Ecocardiograma' && '🫀 '}
                    {label === 'Laboratorio' && '🧪 '}
                    {!['Electrocardiograma','Ecocardiograma','Laboratorio'].includes(label) && '📄 '}
                    {label}
                  </a>
                ))}
              </div>

              {/* Previews de imágenes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estudios.map(({ link, label }) => (
                  <EstudioImagen key={label} link={link} label={label} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer fijo */}
        <div className="border-t border-gray-200 px-6 py-3 rounded-b-2xl shrink-0">
          <button onClick={onClose}
            className="w-full py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallePaciente;