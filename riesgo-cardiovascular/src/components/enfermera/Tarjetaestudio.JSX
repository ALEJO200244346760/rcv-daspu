import React from 'react';
import { obtenerColorRiesgo } from './Enfermerautils';

// ─────────────────────────────────────────────────────────────
// TARJETA RESUMEN DE UN PACIENTE EN EL LISTADO
// ─────────────────────────────────────────────────────────────
const TarjetaEstudio = ({ est, onVerDetalle, onEditar, onEliminar }) => {
  const abrirLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-3">

      {/* Encabezado */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <p className="text-lg font-bold text-gray-800">DNI: {est.dni}</p>
          {est.edad && (
            <p className="text-sm text-gray-500">
              {est.edad} años{est.genero ? ` — ${est.genero}` : ''}
            </p>
          )}
          {est.fechaCarga && (
            <p className="text-xs text-gray-400">
              {new Date(est.fechaCarga).toLocaleDateString('es-AR')}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mt-1">
            {est.nivelRiesgo && (
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${obtenerColorRiesgo(est.nivelRiesgo)}`}>
                Riesgo: {est.nivelRiesgo}
              </span>
            )}
            {est.imc && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                IMC: {est.imc}
              </span>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => onVerDetalle(est)}
            className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg hover:bg-indigo-200 font-semibold transition-colors">
            👁 Ver detalle
          </button>
          <button type="button" onClick={() => onEditar(est)}
            className="px-3 py-1.5 text-sm bg-amber-100 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-200 font-semibold transition-colors">
            ✏️ Editar
          </button>
          <button type="button" onClick={() => onEliminar(est.id)}
            className="px-3 py-1.5 text-sm bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 font-semibold transition-colors">
            🗑️
          </button>
        </div>
      </div>

      {/* Botones de estudios */}
      <div className="flex flex-wrap gap-2">
        {est.linkElectrocardiograma
          ? <button type="button" onClick={() => abrirLink(est.linkElectrocardiograma)}
              className="flex items-center gap-1 px-3 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 text-xs transition-colors">
              ❤️ ECG
            </button>
          : <span className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">Sin ECG</span>
        }
        {est.linkEcocardiograma
          ? <button type="button" onClick={() => abrirLink(est.linkEcocardiograma)}
              className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 text-xs transition-colors">
              🫀 Eco
            </button>
          : <span className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">Sin Eco</span>
        }
        {est.linkLaboratorio
          ? <button type="button" onClick={() => abrirLink(est.linkLaboratorio)}
              className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 text-xs transition-colors">
              🧪 Lab
            </button>
          : <span className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs">Sin Lab</span>
        }
        {est.linkOtroEstudio && (
          <button type="button" onClick={() => abrirLink(est.linkOtroEstudio)}
            className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 text-xs transition-colors">
            📄 {est.nombreOtroEstudio || 'Otro'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TarjetaEstudio;