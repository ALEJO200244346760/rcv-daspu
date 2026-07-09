import React, { useState } from 'react';
import {
  MEDS_HIPERTENSION, MEDS_DIABETES, MEDS_COLESTEROL,
  COMPLICACIONES_EMBARAZO, EVENTOS_CV, SINTOMAS
} from './enfermeraConstantes';

// ─────────────────────────────────────────────────────────────
// HELPERS INTERNOS
// ─────────────────────────────────────────────────────────────
const Field = ({ label, name, value, onChange, type = 'text', placeholder = '', readOnly = false }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-500 mb-0.5">{label}</label>
    <input type={type} name={name} value={value || ''} onChange={onChange}
      placeholder={placeholder} readOnly={readOnly}
      className={`p-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 ${readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300'}`} />
  </div>
);

const SiNoEdit = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold text-gray-500">{label}</span>
    <div className="flex gap-2">
      {['Sí', 'No'].map(op => (
        <button key={op} type="button"
          onClick={() => onChange({ target: { name, value: op } })}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${
            value === op ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}>{op}</button>
      ))}
    </div>
  </div>
);

const CheckboxEdit = ({ label, items, selected, onChange }) => {
  const arr = selected ? selected.split('; ').filter(Boolean) : [];
  const toggle = (item) => {
    const next = arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    onChange({ target: { name: label, value: next.join('; ') } });
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <div className="max-h-36 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2 bg-gray-50">
        {items.map(item => (
          <label key={item} className="flex items-center gap-2 cursor-pointer hover:bg-white px-1 py-0.5 rounded">
            <input type="checkbox" checked={arr.includes(item)} onChange={() => toggle(item)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            <span className="text-xs text-gray-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const CheckboxEventos = ({ value, onChange }) => {
  let obj = {};
  try { obj = JSON.parse(value || '{}'); } catch {}
  const toggle = (ev) => {
    const next = { ...obj, [ev]: !obj[ev] };
    onChange({ target: { name: 'eventosCv', value: JSON.stringify(next) } });
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-500">Eventos cardiovasculares</span>
      <div className="grid grid-cols-2 gap-1 border border-gray-200 rounded-md p-2 bg-gray-50">
        {EVENTOS_CV.map(ev => (
          <label key={ev} className="flex items-center gap-2 cursor-pointer hover:bg-white px-1 py-0.5 rounded">
            <input type="checkbox" checked={!!obj[ev]} onChange={() => toggle(ev)}
              className="h-4 w-4 rounded border-gray-300 text-red-500" />
            <span className="text-xs text-gray-700">{ev}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Sección colapsable
const Seccion = ({ titulo, color = 'indigo', children }) => {
  const [abierta, setAbierta] = useState(false);
  const colors = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    red:    'bg-red-50 border-red-200 text-red-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    green:  'bg-green-50 border-green-200 text-green-800',
  };
  return (
    <div className={`border rounded-lg overflow-hidden ${colors[color]}`}>
      <button type="button" onClick={() => setAbierta(p => !p)}
        className="w-full flex justify-between items-center px-4 py-2.5 text-sm font-bold">
        <span>{titulo}</span>
        <span className="text-lg leading-none">{abierta ? '▲' : '▼'}</span>
      </button>
      {abierta && <div className="px-4 pb-4 pt-2 bg-white space-y-3">{children}</div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MODAL PRINCIPAL
// ─────────────────────────────────────────────────────────────
const ModalEditarEstudio = ({ estudio, guardando, onChange, onGuardar, onCerrar }) => {
  const handle = (e) => onChange(e.target.name, e.target.value);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh]">

        {/* Header fijo */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900">✏️ Editar registro</h3>
            <p className="text-sm text-gray-500">DNI: {estudio.dni}</p>
          </div>
          <button onClick={onCerrar}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            ✕
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">

          {/* ── 1. Datos filiatorios ── */}
          <Seccion titulo="1. Datos Filiatorios" color="indigo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nombre y Apellido" name="nombreApellido" value={estudio.nombreApellido} onChange={handle} placeholder="Juan Pérez" />
              <Field label="DNI" name="dni" value={estudio.dni} onChange={handle} readOnly />
              <Field label="Fecha de nacimiento" name="fechaNacimiento" type="date" value={estudio.fechaNacimiento} onChange={handle} />
              <Field label="Edad" name="edad" value={estudio.edad} onChange={handle} readOnly />
              <Field label="Teléfono" name="telefono" value={estudio.telefono} onChange={handle} placeholder="3515001234" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500">Género</span>
                <div className="flex gap-2">
                  {['masculino','femenino'].map(g => (
                    <button key={g} type="button"
                      onClick={() => onChange('genero', g)}
                      className={`px-4 py-1.5 rounded-lg border text-sm font-semibold transition-all ${
                        estudio.genero === g ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}>{g.charAt(0).toUpperCase() + g.slice(1)}</button>
                  ))}
                </div>
              </div>
            </div>
            {estudio.genero === 'femenino' && (
              <div className="space-y-3 mt-2 pt-3 border-t border-pink-100">
                <SiNoEdit label="¿Tuvo hijos?" name="tuvoHijos" value={estudio.tuvoHijos} onChange={handle} />
                {estudio.tuvoHijos === 'Sí' && (
                  <CheckboxEdit label="Complicaciones en embarazo"
                    items={COMPLICACIONES_EMBARAZO}
                    selected={estudio.complicacionesEmbarazo}
                    onChange={e => onChange('complicacionesEmbarazo', e.target.value)} />
                )}
              </div>
            )}
          </Seccion>

          {/* ── 2. Eventos CV ── */}
          <Seccion titulo="2. Eventos Cardiovasculares" color="red">
            <CheckboxEventos value={estudio.eventosCv} onChange={handle} />
          </Seccion>

          {/* ── 3. Factores de riesgo ── */}
          <Seccion titulo="3. Factores de Riesgo / Medicación" color="orange">
            <SiNoEdit label="¿Toma medicación a diario?" name="tomaMedicacion" value={estudio.tomaMedicacion} onChange={handle} />
            {estudio.tomaMedicacion === 'Sí' && (
              <div className="space-y-3">
                <SiNoEdit label="Hipertensión" name="hipertension" value={estudio.hipertension} onChange={handle} />
                {estudio.hipertension === 'Sí' && (
                  <>
                    <CheckboxEdit label="Medicamentos HTA" items={MEDS_HIPERTENSION}
                      selected={estudio.medsHipertension}
                      onChange={e => onChange('medsHipertension', e.target.value)} />
                    <Field label="Otro medicamento HTA" name="otroMedHipertension" value={estudio.otroMedHipertension} onChange={handle} />
                  </>
                )}
                <SiNoEdit label="Diabetes" name="diabetes" value={estudio.diabetes} onChange={handle} />
                {estudio.diabetes === 'Sí' && (
                  <>
                    <CheckboxEdit label="Medicamentos Diabetes" items={MEDS_DIABETES}
                      selected={estudio.medsDiabetes}
                      onChange={e => onChange('medsDiabetes', e.target.value)} />
                    <Field label="Otro medicamento diabetes" name="otroMedDiabetes" value={estudio.otroMedDiabetes} onChange={handle} />
                  </>
                )}
                <SiNoEdit label="Colesterol elevado" name="colesterol" value={estudio.colesterol} onChange={handle} />
                {estudio.colesterol === 'Sí' && (
                  <>
                    <CheckboxEdit label="Medicamentos Colesterol" items={MEDS_COLESTEROL}
                      selected={estudio.medsColesterol}
                      onChange={e => onChange('medsColesterol', e.target.value)} />
                    <Field label="Otro medicamento colesterol" name="otroMedColesterol" value={estudio.otroMedColesterol} onChange={handle} />
                  </>
                )}
                <SiNoEdit label="Estrés / Ansiedad / Depresión" name="estresAnsiedad" value={estudio.estresAnsiedad} onChange={handle} />
                {estudio.estresAnsiedad === 'Sí' && (
                  <Field label="Detalle estrés" name="estresDetalle" value={estudio.estresDetalle} onChange={handle} />
                )}
                <SiNoEdit label="Otras patologías" name="otrasPatologias" value={estudio.otrasPatologias} onChange={handle} />
                {estudio.otrasPatologias === 'Sí' && (
                  <Field label="Detalle patologías" name="otrasPatologiasDetalle" value={estudio.otrasPatologiasDetalle} onChange={handle} />
                )}
              </div>
            )}
          </Seccion>

          {/* ── 4. Hábitos ── */}
          <Seccion titulo="4. Hábitos" color="green">
            <SiNoEdit label="¿Fuma actualmente?" name="fuma" value={estudio.fuma} onChange={handle} />
            {estudio.fuma === 'No' && (
              <SiNoEdit label="¿Fumó en el pasado?" name="fumoPorMucho" value={estudio.fumoPorMucho} onChange={handle} />
            )}
            <SiNoEdit label="¿Consume alcohol habitualmente?" name="consumeAlcohol" value={estudio.consumeAlcohol} onChange={handle} />
            <SiNoEdit label="¿Duerme 6-8 horas diarias?" name="duerme68" value={estudio.duerme68} onChange={handle} />
            <SiNoEdit label="¿Realiza actividad física 150 min/semana?" name="actividadFisica" value={estudio.actividadFisica} onChange={handle} />
          </Seccion>

          {/* ── 5. Síntomas ── */}
          <Seccion titulo="5. Síntomas de Alarma" color="red">
            <CheckboxEdit label="Síntomas" items={SINTOMAS}
              selected={estudio.sintomas}
              onChange={e => onChange('sintomas', e.target.value)} />
            {estudio.sintomas?.includes('Otro') && (
              <Field label="Especifique el síntoma" name="sintomaOtro" value={estudio.sintomaOtro} onChange={handle} />
            )}
          </Seccion>

          {/* ── 6. Datos antropométricos ── */}
          <Seccion titulo="6. Datos Antropométricos" color="indigo">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="Peso (kg)" name="peso" type="number" value={estudio.peso} onChange={handle} placeholder="75" />
              <Field label="Talla (cm)" name="talla" type="number" value={estudio.talla} onChange={handle} placeholder="170" />
              <Field label="Cintura (cm)" name="cintura" type="number" value={estudio.cintura} onChange={handle} placeholder="90" />
              <Field label="TA Máxima (mmHg)" name="tensionSistolica" type="number" value={estudio.tensionSistolica} onChange={handle} placeholder="120" />
              <Field label="TA Mínima (mmHg)" name="tensionDiastolica" type="number" value={estudio.tensionDiastolica} onChange={handle} placeholder="80" />
            </div>
          </Seccion>

          {/* ── 7. Estudios ── */}
          <Seccion titulo="7. Estudios Complementarios" color="indigo">
            <Field label="Link Electrocardiograma" name="linkElectrocardiograma" value={estudio.linkElectrocardiograma} onChange={handle} placeholder="https://i.ibb.co/..." />
            <Field label="Link Ecocardiograma" name="linkEcocardiograma" value={estudio.linkEcocardiograma} onChange={handle} placeholder="https://i.ibb.co/..." />
            <Field label="Link Laboratorio" name="linkLaboratorio" value={estudio.linkLaboratorio} onChange={handle} placeholder="https://i.ibb.co/..." />
            <Field label="Nombre otro estudio" name="nombreOtroEstudio" value={estudio.nombreOtroEstudio} onChange={handle} placeholder="Ej: Holter" />
            <Field label="Link otro estudio" name="linkOtroEstudio" value={estudio.linkOtroEstudio} onChange={handle} placeholder="https://i.ibb.co/..." />
          </Seccion>

        </div>

        {/* Footer fijo */}
        <div className="border-t border-gray-200 px-6 py-3 flex gap-3 shrink-0">
          <button type="button" onClick={onGuardar} disabled={guardando}
            className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button type="button" onClick={onCerrar}
            className="flex-1 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarEstudio;