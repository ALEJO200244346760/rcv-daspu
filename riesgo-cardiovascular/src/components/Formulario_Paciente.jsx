import React from 'react';

const listaMedicamentosHipertension = [
  "Enalapril 10 mg cada 12 Hs", "Enalapril 5 mg cada 12 Hs",
  "Losartan 25 mg cada 12 Hs", "Losartan 50 mg cada 12 Hs",
  "Amlodipina 10 mg cada12 Hs", "Amlodipina 5 mg cada12 Hs",
  "Hidroclorotiazida 25 mg cada 12 Hs", "Furosemida 20 mg cada 12 Hs",
  "Valsartán 160 mg cada 12 Hs", "Valsartán 80 mg cada 12 Hs",
  "Carvedilol 25 mg cada 12 Hs", "Carvedilol 12,5 mg cada 12 Hs",
  "Bisoprolol 5 mg cada 12 Hs", "Bisoprolol 2,5 mg cada 12 Hs",
  "Nebivolol 10 mg por día", "Nebivolol 5 mg por día",
  "Espironolactona 25 mg por día", "Otros"
];

const listaMedicamentosDiabetes = [
  "Metformina 500 mg dos por dia", "Metformina 850 mg dos por dia",
  "Metformina 1000 mg dos por dia", "Otra"
];

const listaMedicamentosColesterol = [
  "Atorvastatina 10 mg uno por día", "Atorvastatina 20 mg uno por día",
  "Atorvastatina 40 mg uno por día", "Atorvastatina 80 mg uno por día",
  "Rosuvastatina 5 mg uno por día", "Rosuvastatina 10 mg uno por día",
  "Rosuvastatina 20 mg uno por día", "Rosuastatina 40 mg uno por día", "Otra"
];

// Subcomponente reutilizable para listas de medicamentos con checkboxes
const MedicamentoCheckboxList = ({ lista, seleccionados, onChange, idPrefix }) => (
  <div className="max-h-60 overflow-y-auto pr-2">
    {lista.map((med, index) => (
      <div key={index} className="flex items-center my-1">
        <input
          type="checkbox"
          id={`${idPrefix}-${index}`}
          value={med}
          onChange={onChange}
          checked={seleccionados.includes(med)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor={`${idPrefix}-${index}`} className="ml-3 text-sm text-gray-700">
          {med}
        </label>
      </div>
    ))}
  </div>
);

const FormularioPaciente = ({
  datosPaciente,
  manejarCambio,
  setDatosPaciente,
  nivelColesterolConocido,
  manejarSeleccionColesterol,
  medicamentosHipertensionSeleccionados,
  handleHipertensionMedChange,
  otroMedicamentoHipertension,
  setOtroMedicamentoHipertension,
  medicamentosDiabetesSeleccionados,
  handleDiabetesMedChange,
  otroMedicamentoDiabetes,
  setOtroMedicamentoDiabetes,
  medicamentosColesterolSeleccionados,
  handleColesterolMedChange,
  otroMedicamentoColesterol,
  setOtroMedicamentoColesterol,
  setMedicamentosHipertensionSeleccionados,
  setMedicamentosDiabetesSeleccionados,
  setMedicamentosColesterolSeleccionados,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const setField = (field, value) =>
    setDatosPaciente(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      {/* DNI */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">DNI:</label>
        <input type="text" name="cuil" value={datosPaciente.cuil} onChange={manejarCambio}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Teléfono */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Teléfono:</label>
        <input type="number" name="telefono" value={datosPaciente.telefono} onChange={manejarCambio}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Género */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Género:</label>
        <div className="flex space-x-2">
          {['masculino', 'femenino'].map(option => (
            <button key={option} type="button"
              className={`p-2 border rounded ${datosPaciente.genero === option ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setField('genero', option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Campos adicionales para femenino */}
      {datosPaciente.genero === 'femenino' && (
        <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 space-y-4 rounded-r-lg">
          <h3 className="text-lg font-semibold text-gray-800">Información Adicional</h3>
          {[
            { label: 'Número de gestas', name: 'numeroGestas', type: 'number' },
            { label: 'Método anticonceptivo', name: 'metodoAnticonceptivo', type: 'text' },
            { label: 'Trastornos hipertensivos del embarazo', name: 'trastornosHipertensivos', type: 'text' },
            { label: 'Diabetes gestacional', name: 'diabetesGestacional', type: 'text' },
            { label: 'Síndrome de Ovario Poliquístico', name: 'sop', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">{label}:</label>
              <input type={type} name={name} value={datosPaciente[name]} onChange={manejarCambio}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Fecha de última menstruación:</label>
            <input type="date" name="fum" value={datosPaciente.fum} onChange={manejarCambio}
              max={today}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Edad */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Edad:</label>
        <input type="number" name="edad" value={datosPaciente.edad} onChange={manejarCambio}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Hipertensión + medicamentos */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">¿Toma medicamentos para la hipertensión arterial?</label>
        <div className="flex space-x-2 mb-2">
          {['Sí', 'No'].map(option => (
            <button key={option} type="button"
              onClick={() => {
                                setField('hipertenso', option);
                                if (option === 'No') {
                                  setMedicamentosHipertensionSeleccionados([]);
                                  setOtroMedicamentoHipertension("");
                                }
                              }}
              className={`p-2 border rounded-md ${datosPaciente.hipertenso === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
            >{option}</button>
          ))}
        </div>
        {datosPaciente.hipertenso === 'Sí' && (
          <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
            <h4 className="text-md font-semibold text-gray-800">Seleccione los medicamentos:</h4>
            <MedicamentoCheckboxList lista={listaMedicamentosHipertension} seleccionados={medicamentosHipertensionSeleccionados} onChange={handleHipertensionMedChange} idPrefix="med-ht" />
            {medicamentosHipertensionSeleccionados.includes("Otros") && (
              <input type="text" placeholder="Especifique el medicamento" value={otroMedicamentoHipertension}
                onChange={(e) => setOtroMedicamentoHipertension(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        )}
      </div>

      {/* Diabetes + medicamentos */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">¿Toma medicamentos para Diabetes?</label>
        <div className="flex space-x-2">
          {['Sí', 'No'].map(option => (
            <button key={option} type="button"
              onClick={() => {
                setField('diabetes', option);
                if (option === 'No') {
                  setMedicamentosDiabetesSeleccionados([]);
                  setOtroMedicamentoDiabetes("");
                }
              }}
              className={`p-2 border rounded-md ${datosPaciente.diabetes === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
            >{option}</button>
          ))}
        </div>
        {datosPaciente.diabetes === 'Sí' && (
          <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
            <h4 className="text-md font-semibold text-gray-800">Seleccione los medicamentos:</h4>
            <MedicamentoCheckboxList lista={listaMedicamentosDiabetes} seleccionados={medicamentosDiabetesSeleccionados} onChange={handleDiabetesMedChange} idPrefix="med-db" />
            {medicamentosDiabetesSeleccionados.includes("Otra") && (
              <input type="text" placeholder="Especifique el medicamento" value={otroMedicamentoDiabetes}
                onChange={(e) => setOtroMedicamentoDiabetes(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        )}
      </div>

      {/* Colesterol + medicamentos */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">¿Toma medicamentos para el colesterol?</label>
        <div className="flex space-x-2">
          {['Sí', 'No'].map(option => (
            <button key={option} type="button"
              onClick={() => {
                setField('medicolesterol', option);
                if (option === 'No') {
                  setMedicamentosColesterolSeleccionados([]);
                  setOtroMedicamentoColesterol("");
                }
              }}
              className={`p-2 border rounded-md ${datosPaciente.medicolesterol === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
            >{option}</button>
          ))}
        </div>
        {datosPaciente.medicolesterol === 'Sí' && (
          <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
            <h4 className="text-md font-semibold text-gray-800">Seleccione los medicamentos:</h4>
            <MedicamentoCheckboxList lista={listaMedicamentosColesterol} seleccionados={medicamentosColesterolSeleccionados} onChange={handleColesterolMedChange} idPrefix="med-col" />
            {medicamentosColesterolSeleccionados.includes("Otra") && (
              <input type="text" placeholder="Especifique el medicamento" value={otroMedicamentoColesterol}
                onChange={(e) => setOtroMedicamentoColesterol(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        )}
      </div>

      {/* Nivel de colesterol conocido */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">¿Conoce su nivel de colesterol?</label>
        <div className="flex space-x-2 mb-2">
          {['si', 'no'].map(option => (
            <button key={option} type="button"
              onClick={() => manejarSeleccionColesterol(option)}
              className={`p-2 border rounded-md ${nivelColesterolConocido === (option === 'si') ? 'bg-green-500 text-white' : 'border-gray-300'}`}
            >
              {option === 'si' ? 'Sí' : 'No'}
            </button>
          ))}
        </div>
        {nivelColesterolConocido && (
          <input
            type="number"
            name="colesterol"
            placeholder="Nivel de colesterol (mg/dl)"
            value={datosPaciente.colesterol === 'No' ? '' : datosPaciente.colesterol}
            onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        )}
      </div>

      {/* Botones Sí/No simples */}
      {[
        { label: '¿Toma aspirina o anticuagulantes?', field: 'aspirina', options: ['sí', 'no'] },
        { label: '¿Es fumador?', field: 'fumador', options: ['sí', 'no'] },
        { label: '¿Es exfumador?', field: 'exfumador', options: ['sí', 'no'] },
        { label: '¿Presenta enfermedad cardiovascular como infarto o acv?', field: 'enfermedad', options: ['Sí', 'No'] },
        { label: '¿Ha tenido un infarto?', field: 'infarto', options: ['Sí', 'No'] },
        { label: '¿Ha tenido un ACV?', field: 'acv', options: ['Sí', 'No'] },
        { label: '¿Tiene enfermedad Renal Crónica?', field: 'renal', options: ['Sí', 'No'] },
        { label: '¿Tiene enfermedad Pulmonar?', field: 'pulmonar', options: ['Sí', 'No'] },
        { label: '¿Alergias a medicamentos o antibióticos?', field: 'alergias', options: ['Sí', 'No'] },
        { label: '¿Toma remedios para la tiroides?', field: 'tiroides', options: ['Sí', 'No'] },
        { label: '¿Realiza actividad física regularmente?', field: 'sedentarismo', options: ['Sí', 'No'] },
        { label: '¿Duerme entre 6 a 8 horas por día?', field: 'sueño', options: ['Sí', 'No'] },
      ].map(({ label, field, options }) => (
        <div key={field} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <div className="flex space-x-2 mb-2">
            {options.map(option => (
              <button key={option} type="button"
                onClick={() => setField(field, option)}
                className={`p-2 border rounded-md ${datosPaciente[field] === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* TA Máx */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">TA Máx.:</label>
        <input type="number" name="presionArterial" value={datosPaciente.presionArterial} onChange={manejarCambio}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {[80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 200, 220, 240].map(valor => (
            <button key={valor} type="button"
              className={`p-2 border rounded ${datosPaciente.presionArterial === valor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setField('presionArterial', valor)}
            >{valor}</button>
          ))}
        </div>
      </div>

      {/* TA Mín */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">TA Min.:</label>
        <input type="number" name="taMin" value={datosPaciente.taMin} onChange={manejarCambio}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {[60, 70, 80, 90, 100, 110, 120, 130].map(valor => (
            <button key={valor} type="button"
              className={`p-2 border rounded ${datosPaciente.taMin === valor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setField('taMin', valor)}
            >{valor}</button>
          ))}
          <button type="button"
            className={`p-2 border rounded ${datosPaciente.taMin > 130 ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setField('taMin', 131)}
          >+130</button>
        </div>
      </div>

      {/* Peso, Talla, Cintura */}
      {[
        { label: 'Peso (kg)', name: 'peso' },
        { label: 'Talla (cm)', name: 'talla' },
        { label: 'Cintura (cm)', name: 'cintura' },
      ].map(({ label, name }) => (
        <div key={name} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">{label}:</label>
          <input type="number" name={name} value={datosPaciente[name]} onChange={manejarCambio}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      ))}
    </div>
  );
};

export default Formulario_Paciente;