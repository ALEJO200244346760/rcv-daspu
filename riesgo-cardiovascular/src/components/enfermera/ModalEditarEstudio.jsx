import React from 'react';

// ─────────────────────────────────────────────────────────────
// MODAL PARA EDITAR LOS LINKS DE ESTUDIOS
// ─────────────────────────────────────────────────────────────
const CAMPOS_EDITAR = [
  { label: 'Link Electrocardiograma', key: 'linkElectrocardiograma' },
  { label: 'Link Ecocardiograma',     key: 'linkEcocardiograma'     },
  { label: 'Link Laboratorio',        key: 'linkLaboratorio'        },
  { label: 'Nombre otro estudio',     key: 'nombreOtroEstudio'      },
  { label: 'Link otro estudio',       key: 'linkOtroEstudio'        },
];

const ModalEditarEstudio = ({ estudio, guardando, onChange, onGuardar, onCerrar }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800">✏️ Editar estudios — DNI {estudio.dni}</h3>

      {CAMPOS_EDITAR.map(({ label, key }) => (
        <div key={key} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            value={estudio[key] || ''}
            onChange={e => onChange(key, e.target.value)}
            placeholder={key.startsWith('link') ? 'https://ibb.co/...' : ''}
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onGuardar} disabled={guardando}
          className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={onCerrar}
          className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

export default ModalEditarEstudio;