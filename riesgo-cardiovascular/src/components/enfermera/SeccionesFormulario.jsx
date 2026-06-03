import React from 'react';
import { SiNo, CheckList, CheckboxList, SeccionHeader } from './Enfermeraui';
import {
  COMPLICACIONES_EMBARAZO, EVENTOS_CV, SINTOMAS,
  MEDS_HIPERTENSION, MEDS_DIABETES, MEDS_COLESTEROL
} from './EnfermeraConstantes';
import { calcularIMC, obtenerColorRiesgo } from './EnfermeraUtils';

// ─────────────────────────────────────────────────────────────
// LAS 7 SECCIONES DEL FORMULARIO — cada una recibe form, set, toggle
// ─────────────────────────────────────────────────────────────

export const SeccionFiliatorios = ({ form, set, handle, setSiNo, toggleArray }) => {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
      <SeccionHeader num="1" titulo="Datos Filiatorios" color="indigo" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">DNI *</label>
          <input name="dni" value={form.dni} onChange={handle} placeholder="Ej: 30123456"
            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
          <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handle}
            max={today}
            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Edad (calculada automáticamente)</label>
          <input value={form.edad ? `${form.edad} años` : ''} readOnly placeholder="—"
            className="p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handle} placeholder="Ej: 3515001234"
            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Género</span>
        <div className="flex gap-2">
          {['masculino','femenino'].map(g => (
            <button key={g} type="button" onClick={() => set('genero', g)}
              className={`px-5 py-2 rounded-lg border font-semibold text-sm transition-all ${
                form.genero === g ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}>{g.charAt(0).toUpperCase() + g.slice(1)}</button>
          ))}
        </div>
      </div>

      {form.genero === 'femenino' && (
        <div className="p-4 border-l-4 border-pink-400 bg-pink-50 rounded-r-lg space-y-4">
          <h3 className="text-base font-bold text-pink-800">Historial Ginecológico</h3>
          <SiNo label="¿Tuvo hijos?" name="tuvoHijos" value={form.tuvoHijos} onChange={setSiNo} />
          {form.tuvoHijos === 'Sí' && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Complicaciones en algún embarazo:</p>
              <CheckList items={COMPLICACIONES_EMBARAZO} selected={form.complicacionesEmbarazo}
                onChange={(item) => toggleArray('complicacionesEmbarazo', item)} color="pink" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const SeccionEventoCV = ({ form, toggleEvento }) => (
  <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
    <SeccionHeader num="2" titulo="Evento Cardiovascular" color="red" />
    <p className="text-sm text-gray-500">Tildá las enfermedades que haya tenido el paciente:</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {EVENTOS_CV.map(ev => (
        <label key={ev} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition-all">
          <input type="checkbox" checked={!!form.eventosCv[ev]} onChange={() => toggleEvento(ev)}
            className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400" />
          <span className="text-sm font-medium text-gray-700">{ev}</span>
        </label>
      ))}
    </div>
  </div>
);

export const SeccionFactoresRiesgo = ({ form, set, setSiNo, toggleArray }) => (
  <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
    <SeccionHeader num="3" titulo="Factores de Riesgo Cardiovascular" color="orange" />
    <SiNo label="¿Toma medicación a diario?" name="tomaMedicacion" value={form.tomaMedicacion} onChange={setSiNo} />
    {form.tomaMedicacion === 'Sí' && (
      <div className="space-y-5 pt-2">
        {/* Hipertensión */}
        <div className="space-y-2">
          <SiNo label="Hipertensión" name="hipertension" value={form.hipertension} onChange={setSiNo} />
          {form.hipertension === 'Sí' && (
            <div className="pl-4 border-l-4 border-orange-300 bg-orange-50 p-3 rounded-r-lg space-y-2">
              <p className="text-sm font-semibold text-gray-700">Seleccione los medicamentos:</p>
              <CheckboxList items={MEDS_HIPERTENSION} selected={form.medsHipertension}
                onChange={(item) => toggleArray('medsHipertension', item)} />
              {form.medsHipertension.includes('Otros') && (
                <input placeholder="Especifique el medicamento" value={form.otroMedHipertension}
                  onChange={e => set('otroMedHipertension', e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm" />
              )}
            </div>
          )}
        </div>
        {/* Diabetes */}
        <div className="space-y-2">
          <SiNo label="Diabetes" name="diabetes" value={form.diabetes} onChange={setSiNo} />
          {form.diabetes === 'Sí' && (
            <div className="pl-4 border-l-4 border-orange-300 bg-orange-50 p-3 rounded-r-lg space-y-2">
              <p className="text-sm font-semibold text-gray-700">Seleccione los medicamentos:</p>
              <CheckboxList items={MEDS_DIABETES} selected={form.medsDiabetes}
                onChange={(item) => toggleArray('medsDiabetes', item)} />
              {form.medsDiabetes.includes('Otros') && (
                <input placeholder="Especifique el medicamento" value={form.otroMedDiabetes}
                  onChange={e => set('otroMedDiabetes', e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm" />
              )}
            </div>
          )}
        </div>
        {/* Colesterol */}
        <div className="space-y-2">
          <SiNo label="Colesterol elevado" name="colesterol" value={form.colesterol} onChange={setSiNo} />
          {form.colesterol === 'Sí' && (
            <div className="pl-4 border-l-4 border-orange-300 bg-orange-50 p-3 rounded-r-lg space-y-2">
              <p className="text-sm font-semibold text-gray-700">Seleccione los medicamentos:</p>
              <CheckboxList items={MEDS_COLESTEROL} selected={form.medsColesterol}
                onChange={(item) => toggleArray('medsColesterol', item)} />
              {form.medsColesterol.includes('Otros') && (
                <input placeholder="Especifique el medicamento" value={form.otroMedColesterol}
                  onChange={e => set('otroMedColesterol', e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm" />
              )}
            </div>
          )}
        </div>
        {/* Estrés */}
        <div className="space-y-2">
          <SiNo label="Estrés / Angustia / Ansiedad / Depresión" name="estresAnsiedad" value={form.estresAnsiedad} onChange={setSiNo} />
          {form.estresAnsiedad === 'Sí' && (
            <textarea rows={2} placeholder="Si desea, especifique (opcional)..."
              value={form.estresDetalle} onChange={e => set('estresDetalle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none" />
          )}
        </div>
        {/* Otras */}
        <div className="space-y-2">
          <SiNo label="Otras patologías" name="otrasPatologias" value={form.otrasPatologias} onChange={setSiNo} />
          {form.otrasPatologias === 'Sí' && (
            <textarea rows={2} placeholder="Especifique las patologías..."
              value={form.otrasPatologiasDetalle} onChange={e => set('otrasPatologiasDetalle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none" />
          )}
        </div>
      </div>
    )}
  </div>
);

export const SeccionHabitos = ({ form, setSiNo }) => (
  <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
    <SeccionHeader num="4" titulo="Hábitos" color="green" />
    <SiNo label="¿Fuma actualmente?" name="fuma" value={form.fuma} onChange={setSiNo} />
    {form.fuma === 'No' && (
      <SiNo label="¿Fumó por mucho tiempo en el pasado?" name="fumoPorMucho" value={form.fumoPorMucho} onChange={setSiNo} />
    )}
    <SiNo label="¿Consume bebidas alcohólicas de manera habitual?" name="consumeAlcohol" value={form.consumeAlcohol} onChange={setSiNo} />
    <SiNo label="¿Duerme entre 6 y 8 horas diarias?" name="duerme68" value={form.duerme68} onChange={setSiNo} />
    <SiNo label="¿Realiza actividad física 150 minutos semanales?" name="actividadFisica" value={form.actividadFisica} onChange={setSiNo} />
  </div>
);

export const SeccionSintomas = ({ form, set, toggleArray }) => (
  <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
    <SeccionHeader num="5" titulo="Síntomas de Alarma" color="red" />
    <CheckList items={SINTOMAS} selected={form.sintomas}
      onChange={(item) => toggleArray('sintomas', item)} color="red" />
    {form.sintomas.includes('Otro') && (
      <input placeholder="Especifique el síntoma..."
        value={form.sintomaOtro} onChange={e => set('sintomaOtro', e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md text-sm mt-1" />
    )}
  </div>
);

export const SeccionAntropometrica = ({ form, set, handle, nivelRiesgo }) => {
  const imc = calcularIMC(form.peso, form.talla);
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
      <SeccionHeader num="6" titulo="Datos Antropométricos y Clínicos" color="indigo" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Peso (kg)', name: 'peso', placeholder: 'Ej: 75' },
          { label: 'Talla (cm)', name: 'talla', placeholder: 'Ej: 170' },
          { label: 'Tensión Máxima (mmHg)', name: 'tensionSistolica', placeholder: 'Ej: 120' },
          { label: 'Tensión Mínima (mmHg)', name: 'tensionDiastolica', placeholder: 'Ej: 80' },
        ].map(({ label, name, placeholder }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type="number" name={name} value={form[name]} onChange={handle} placeholder={placeholder}
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        ))}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Cintura (cm)</label>
          <input type="number" name="cintura" value={form.cintura} onChange={handle} placeholder="Ej: 90"
            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-2" />
          <div className="flex gap-2">
            <button type="button" onClick={() => set('cintura', '89')}
              className="flex-1 text-xs py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Mayor que 88 cm
            </button>
            <button type="button" onClick={() => set('cintura', '88')}
              className="flex-1 text-xs py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Menor o igual a 88 cm
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">IMC</p>
          <p className="text-xl font-bold text-indigo-800">
            {imc ? `${imc.valor} — ${imc.clasificacion}` : 'Ingresá peso y talla'}
          </p>
        </div>
        <div className={`p-4 rounded-lg border-2 ${obtenerColorRiesgo(nivelRiesgo)}`}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">Riesgo Cardiovascular</p>
          <p className="text-xl font-bold">{nivelRiesgo || 'Completá los datos necesarios'}</p>
        </div>
      </div>
    </div>
  );
};

export const SeccionEstudios = ({ form, set, handle, setSiNo }) => (
  <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
    <SeccionHeader num="7" titulo="Estudios Complementarios" color="indigo" />
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 space-y-3">
      <p className="text-sm font-bold text-yellow-800">📋 ¿Cómo subir la foto del estudio?</p>
      <ol className="text-sm text-yellow-900 space-y-1 list-decimal list-inside">
        <li>Hacé clic en el botón azul <strong>"Abrir ImgBB para subir foto"</strong></li>
        <li>En la página que se abre, hacé clic en <strong>"Start uploading"</strong></li>
        <li>Elegí la foto del estudio desde la computadora o el celular</li>
        <li>Una vez subida, copiá el link que dice <strong>"Direct link"</strong> (link directo)</li>
        <li>Volvé a esta página y pegá ese link en el campo correspondiente</li>
      </ol>
      <div className="bg-yellow-100 border border-yellow-400 rounded p-2 text-xs text-yellow-900">
        ⚠️ <strong>Importante:</strong> usá el link <strong>"Direct link"</strong> (empieza con <code>https://i.ibb.co/</code>), no el link de la página.
      </div>
      <button type="button"
        onClick={() => window.open('https://imgbb.com/upload', '_blank', 'noopener,noreferrer')}
        className="mt-2 w-full py-3 bg-blue-600 text-white font-bold text-base rounded-lg hover:bg-blue-700 transition-colors shadow">
        📤 Abrir ImgBB para subir foto
      </button>
    </div>

    {[
      { label: 'Electrocardiograma', name: 'linkElectrocardiograma' },
      { label: 'Ecocardiograma',     name: 'linkEcocardiograma'     },
      { label: 'Laboratorio',        name: 'linkLaboratorio'        },
    ].map(({ label, name }) => (
      <div key={name} className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Link — {label} <span className="text-gray-400 font-normal">(pegá el Direct link de ImgBB)</span>
        </label>
        <input type="url" name={name} value={form[name]} onChange={handle}
          placeholder="https://i.ibb.co/..."
          className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
    ))}

    <SiNo label="¿Tiene otro estudio para cargar?" name="tieneOtroEstudio" value={form.tieneOtroEstudio} onChange={setSiNo} />
    {form.tieneOtroEstudio === 'Sí' && (
      <div className="space-y-3 pl-4 border-l-4 border-indigo-200">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Nombre del estudio</label>
          <input name="nombreOtroEstudio" value={form.nombreOtroEstudio} onChange={handle}
            placeholder="Ej: Holter, Ergometría..."
            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Link del estudio <span className="text-gray-400 font-normal">(Direct link de ImgBB)</span>
          </label>
          <input type="url" name="linkOtroEstudio" value={form.linkOtroEstudio} onChange={handle}
            placeholder="https://i.ibb.co/..."
            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>
    )}
  </div>
);
