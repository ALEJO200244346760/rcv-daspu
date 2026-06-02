import React from 'react';
import { obtenerColorRiesgo } from './enfermeraUtils';

// ─────────────────────────────────────────────────────────────
// COMPONENTES UI REUTILIZABLES
// ─────────────────────────────────────────────────────────────

export const SiNo = ({ label, value, onChange, name }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="flex gap-2">
      {['Sí','No'].map(op => (
        <button key={op} type="button" onClick={() => onChange(name, op)}
          className={`px-4 py-2 rounded-lg border font-semibold text-sm transition-all ${
            value === op
              ? 'bg-indigo-600 text-white border-indigo-600 shadow'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >{op}</button>
      ))}
    </div>
  </div>
);

export const CheckList = ({ items, selected, onChange, color = 'indigo' }) => (
  <div className="flex flex-wrap gap-2">
    {items.map(item => {
      const active = selected.includes(item);
      const colorMap = {
        indigo: active ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        red:    active ? 'bg-red-500 text-white border-red-500'       : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        pink:   active ? 'bg-pink-500 text-white border-pink-500'     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
      };
      return (
        <button key={item} type="button" onClick={() => onChange(item)}
          className={`px-3 py-2 text-sm rounded-lg border transition-all ${colorMap[color] || colorMap.indigo}`}
        >{item}</button>
      );
    })}
  </div>
);

export const CheckboxList = ({ items, selected, onChange }) => (
  <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
    {items.map((item, i) => (
      <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
        <input type="checkbox" checked={selected.includes(item)} onChange={() => onChange(item)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
        <span className="text-sm text-gray-700">{item}</span>
      </label>
    ))}
  </div>
);

export const SeccionHeader = ({ num, titulo, color = 'indigo' }) => {
  const colorMap = {
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-800', border: 'border-indigo-200' },
    red:    { bg: 'bg-red-500',    text: 'text-red-800',    border: 'border-red-200'    },
    orange: { bg: 'bg-orange-500', text: 'text-orange-800', border: 'border-orange-200' },
    green:  { bg: 'bg-green-600',  text: 'text-green-800',  border: 'border-green-200'  },
    pink:   { bg: 'bg-pink-500',   text: 'text-pink-800',   border: 'border-pink-200'   },
  };
  const { bg, text, border } = colorMap[color] || colorMap.indigo;
  return (
    <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${border}`}>
      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${bg} text-white text-sm font-bold shrink-0`}>{num}</span>
      <h2 className={`text-lg font-bold ${text}`}>{titulo}</h2>
    </div>
  );
};

export const Fila = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-2 py-1 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 w-44 shrink-0">{label}</span>
      <span className="text-xs text-gray-800 break-words">{value}</span>
    </div>
  );
};

// Tarjeta de estudio con preview de imagen + botón para abrir en nueva pestaña
export const EstudioImagen = ({ link, label }) => {
  if (!link) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
      <div className="relative group">
        <img
          src={link}
          alt={label}
          className="w-full rounded-lg border border-gray-200 object-contain max-h-56 bg-gray-50"
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback cuando la imagen no carga (link de página, no imagen directa) */}
        <div style={{ display: 'none' }}
          className="w-full h-24 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex-col items-center justify-center gap-1 text-center p-3">
          <p className="text-xs text-gray-400">Vista previa no disponible</p>
          <a href={link} target="_blank" rel="noopener noreferrer"
            className="text-xs text-indigo-600 underline font-semibold">
            Abrir {label} →
          </a>
        </div>
      </div>
      <a href={link} target="_blank" rel="noopener noreferrer"
        className="inline-block text-xs text-indigo-600 underline">
        Abrir en nueva pestaña →
      </a>
    </div>
  );
};

// Badge de riesgo reutilizable
export const BadgeRiesgo = ({ nivel }) => {
  if (!nivel) return null;
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${obtenerColorRiesgo(nivel)}`}>
      Riesgo: {nivel}
    </span>
  );
};