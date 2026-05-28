import React from 'react';

const listaSintomaAlarma = [
  "Dolor en el pecho o falta de aire al hacer esfuerzos",
  "Hinchazón de piernas, manos o cara por la tarde",
  "Micción frecuente nocturna",
  "Despertar por falta de aire o palpitaciones",
  "Mareos / desmayos / pérdidas de conocimiento",
  "Otro",
  "Ninguno"
];

const listaInterconsulta = [
  "Clínica médica", "Endocrinología", "Ginecología", "Urología",
  "Psiquiatría", "Nutrición", "Neumonología", "Hematología", "Oftalmología", "Otro"
];

const listaSolicitarEstudios = [
  "Ecocardiograma", "Ergometría", "Holter", "Mapeo",
  "Vasos de cuello", "Doppler MMII", "Ecografía abdominal", "Rayos X Tórax", "Otro"
];

const listaCambioMedicacion = ["Agrego", "Aumento", "Suspendo", "Reduzco", "Otro"];

const ToggleButtonGroup = ({ options, selected, onChange, colorActive }) => (
  <div className="flex flex-wrap gap-2 mb-2">
    {options.map(option => (
      <button
        key={option}
        type="button"
        onClick={() => onChange(option)}
        className={`p-2 text-sm border rounded-md transition-all ${
          selected.includes(option)
            ? `${colorActive} text-white shadow-sm`
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

const SeccionClinica = ({ seleccionesClinicas, setSeleccionesClinicas, otrosClinicos, setOtrosClinicos }) => {
  const toggle = (categoria, value) => {
    setSeleccionesClinicas(prev => {
      const exists = prev[categoria].includes(value);
      const updated = exists
        ? prev[categoria].filter(v => v !== value)
        : [...prev[categoria], value];
      return { ...prev, [categoria]: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Síntomas de alarma */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">Síntomas de alarma</label>
        <ToggleButtonGroup
          options={listaSintomaAlarma}
          selected={seleccionesClinicas.sintomaAlarma}
          onChange={(v) => toggle('sintomaAlarma', v)}
          colorActive="bg-red-500 border-red-500"
        />
        {seleccionesClinicas.sintomaAlarma.includes("Otro") && (
          <input
            type="text"
            placeholder="Especifique el síntoma"
            value={otrosClinicos.sintomaAlarmaOtro}
            onChange={(e) => setOtrosClinicos({ ...otrosClinicos, sintomaAlarmaOtro: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-red-500 outline-none"
          />
        )}
      </div>

      {/* Interconsulta */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">Interconsulta</label>
        <ToggleButtonGroup
          options={listaInterconsulta}
          selected={seleccionesClinicas.interconsulta}
          onChange={(v) => toggle('interconsulta', v)}
          colorActive="bg-blue-500 border-blue-500"
        />
        {seleccionesClinicas.interconsulta.includes("Otro") && (
          <input
            type="text"
            placeholder="Especifique la especialidad"
            value={otrosClinicos.interconsultaOtro}
            onChange={(e) => setOtrosClinicos({ ...otrosClinicos, interconsultaOtro: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        )}
      </div>

      {/* Solicitar estudios */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">Solicitar estudios complementarios</label>
        <ToggleButtonGroup
          options={listaSolicitarEstudios}
          selected={seleccionesClinicas.solicitarEstudios}
          onChange={(v) => toggle('solicitarEstudios', v)}
          colorActive="bg-purple-500 border-purple-500"
        />
        {seleccionesClinicas.solicitarEstudios.includes("Otro") && (
          <input
            type="text"
            placeholder="Especifique el estudio"
            value={otrosClinicos.solicitarEstudiosOtro}
            onChange={(e) => setOtrosClinicos({ ...otrosClinicos, solicitarEstudiosOtro: e.target.value })}
            className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-500 outline-none"
          />
        )}
      </div>

      {/* Cambio de medicación */}
      <div className="flex flex-col mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2">Cambio de medicación</label>
        <ToggleButtonGroup
          options={listaCambioMedicacion}
          selected={seleccionesClinicas.cambioMedicacion}
          onChange={(v) => toggle('cambioMedicacion', v)}
          colorActive="bg-green-600 border-green-600"
        />
        <div className="space-y-2 mt-2">
          {seleccionesClinicas.cambioMedicacion.includes("Agrego") && (
            <input type="text" placeholder="¿Qué medicamento agrega?"
              value={otrosClinicos.cambioAgrego}
              onChange={(e) => setOtrosClinicos({ ...otrosClinicos, cambioAgrego: e.target.value })}
              className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
            />
          )}
          {seleccionesClinicas.cambioMedicacion.includes("Aumento") && (
            <input type="text" placeholder="¿Qué aumentó y a cuánto? (ej: Enalapril 20mg)"
              value={otrosClinicos.cambioAumento}
              onChange={(e) => setOtrosClinicos({ ...otrosClinicos, cambioAumento: e.target.value })}
              className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
            />
          )}
          {seleccionesClinicas.cambioMedicacion.includes("Suspendo") && (
            <input type="text" placeholder="¿Qué medicamento suspendió?"
              value={otrosClinicos.cambioSuspendo}
              onChange={(e) => setOtrosClinicos({ ...otrosClinicos, cambioSuspendo: e.target.value })}
              className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
            />
          )}
          {seleccionesClinicas.cambioMedicacion.includes("Reduzco") && (
            <input type="text" placeholder="¿Qué redujo y a cuánto?"
              value={otrosClinicos.cambioReduzco}
              onChange={(e) => setOtrosClinicos({ ...otrosClinicos, cambioReduzco: e.target.value })}
              className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
            />
          )}
          {seleccionesClinicas.cambioMedicacion.includes("Otro") && (
            <input type="text" placeholder="Especifique otro cambio"
              value={otrosClinicos.cambioMedicacionOtro}
              onChange={(e) => setOtrosClinicos({ ...otrosClinicos, cambioMedicacionOtro: e.target.value })}
              className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeccionClinica;
