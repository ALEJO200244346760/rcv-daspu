import React from 'react';

// ─────────────────────────────────────────────────────────────
// PANEL DE FILTROS
// ─────────────────────────────────────────────────────────────

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select name={name} value={value} onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <option value="">Todos</option>
      {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
  </div>
);

const InputFiltro = ({ label, name, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
  </div>
);

const FiltrosEstadisticas = ({ filtros, nivelColesterolConocido, onChange, onColesterolChange, onAplicar }) => (
  <div className="flex flex-col md:flex-row items-start gap-4">
    <div className="flex-1">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select label="Edad" name="edad" value={filtros.edad} onChange={onChange} options={[
          ['0-40','Menor o igual a 40'], ['41-50','41-50'], ['51-60','51-60'],
          ['61-70','61-70'], ['71+','Mayores de 71'],
        ]} />
        <Select label="Género" name="genero" value={filtros.genero} onChange={onChange} options={[
          ['Masculino','Masculino'], ['Femenino','Femenino'],
        ]} />
        <Select label="¿Diabetes?" name="diabetes" value={filtros.diabetes} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="¿Fumador?" name="fumador" value={filtros.fumador} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="¿Exfumador?" name="exfumador" value={filtros.exfumador} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="Tensión Máxima" name="presionArterial" value={filtros.presionArterial} onChange={onChange} options={[
          ['120','120'], ['140','140'], ['160','160'], ['180','180'],
        ]} />

        {/* Colesterol */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Colesterol</label>
          <select value={nivelColesterolConocido} onChange={onColesterolChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm">
            <option value="todos">Todos</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
          {nivelColesterolConocido === 'si' && (
            <select name="nivelColesterol" value={filtros.nivelColesterol} onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm">
              <option value="">Seleccione un Nivel</option>
              <option value="4">Muy Bajo (&lt;154)</option>
              <option value="5">Bajo (155-192)</option>
              <option value="6">Moderado (193-231)</option>
              <option value="7">Alto (232-269)</option>
              <option value="8">Muy Alto (&gt;270)</option>
            </select>
          )}
        </div>

        <Select label="Nivel de Riesgo" name="nivelRiesgo" value={filtros.nivelRiesgo} onChange={onChange} options={[
          ['<10% Bajo','Bajo'], ['>10% <20% Moderado','Moderado'], ['>20% <30% Alto','Alto'],
          ['>30% <40% Muy Alto','Muy Alto'], ['>40% Crítico','Crítico'],
        ]} />
        <Select label="IMC" name="imc" value={filtros.imc} onChange={onChange} options={[
          ['<18.5','< 18.5'], ['18.5-24.9','Saludable'], ['25-29.9','Sobrepeso'],
          ['30-34.9','Obesidad 1'], ['35-39.9','Obesidad 2'], ['40+','Obesidad 3'],
        ]} />
        <Select label="¿Infarto?" name="infarto" value={filtros.infarto} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="¿ACV?" name="acv" value={filtros.acv} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="¿Hipertenso?" name="hipertenso" value={filtros.hipertenso} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="Cintura" name="cintura" value={filtros.cintura} onChange={onChange} options={[
          ['<88','< 88'], ['88+','> 88'], ['<102','< 102'], ['102+','> 102'],
        ]} />
        <Select label="¿Alergias?" name="alergias" value={filtros.alergias} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="¿Tiroides?" name="tiroides" value={filtros.tiroides} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="¿Sedentarismo?" name="sedentarismo" value={filtros.sedentarismo} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <Select label="¿Aspirina?" name="aspirina" value={filtros.aspirina} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        <InputFiltro label="TFG" name="tfg" type="number" value={filtros.tfg} onChange={onChange} placeholder="Filtrar por TFG" />
        <InputFiltro label="Enfermedad" name="enfermedad" value={filtros.enfermedad} onChange={onChange} placeholder="Filtrar por enfermedad" />

        {/* Campos femeninos */}
        {filtros.genero === 'Femenino' && <>
          <InputFiltro label="Número de Gestas" name="numeroGestas" type="number" value={filtros.numeroGestas} onChange={onChange} />
          <InputFiltro label="FUM" name="fum" value={filtros.fum} onChange={onChange} />
          <InputFiltro label="Método Anticonceptivo" name="metodoAnticonceptivo" value={filtros.metodoAnticonceptivo} onChange={onChange} />
          <Select label="Trastornos Hipertensivos" name="trastornosHipertensivos" value={filtros.trastornosHipertensivos} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
          <Select label="Diabetes Gestacional" name="diabetesGestacional" value={filtros.diabetesGestacional} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
          <Select label="SOP" name="sop" value={filtros.sop} onChange={onChange} options={[['Sí','Sí'],['No','No']]} />
        </>}
      </div>

      <button onClick={onAplicar}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700">
        Aplicar Filtros
      </button>
    </div>
  </div>
);

export default FiltrosEstadisticas;