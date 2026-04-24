import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Advertencia } from './ConstFormulario'
import EstadisticasGraficos from './EstadisticasGraficos'; // Asegúrate de que la ruta sea correcta

function Estadisticas() {
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({
    edad: '',
    cuil: '',
    genero: '',
    diabetes: '',
    fumador: '',
    exfumador: '',
    presionArterial: '',
    colesterol: '',
    nivelColesterol: '', // Campo para el nivel específico de colesterol
    nivelRiesgo: '',
    ubicacion: '',
    imc: '',
    infarto: '',
    acv: '',
    cintura: '',
    hipertenso: '',
    doctor: '',
    // Nuevos filtros basados en DatosPacienteInicial
    medicamentosHipertension: '',
    medicamentosDiabetes: '',
    medicamentosColesterol: '',
    aspirina: '',
    tfg: '',
    numeroGestas: '',
    fum: '',
    metodoAnticonceptivo: '',
    trastornosHipertensivos: '',
    diabetesGestacional: '',
    sop: '',
    enfermedad: '',
    alergias: '',
    tiroides: '',
    sedentarismo: '',
  });
  const [nivelColesterolConocido, setNivelColesterolConocido] = useState('todos'); // Estado para el conocimiento del nivel de colesterol
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mostrarDetalles, setMostrarDetalles] = useState({}); // Estado para mostrar detalles de cada paciente
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  const toggleDetalles = (id) => {
    setMostrarDetalles((prev) => ({
      ...prev,
      [id]: !prev[id], // Alterna la visibilidad de los detalles
    }));
  };

  // Configuración de la URL base para la API
  const apiBaseURL = 'https://rcv-daspu-production.up.railway.app';

  // Hook useEffect para obtener datos de pacientes desde la API
  useEffect(() => {
    axios.get(`${apiBaseURL}/api/pacientes`)
      .then(response => {
        console.log('Datos de respuesta:', response.data); // Verifica la estructura de los datos
        const data = response.data;

        // Verifica el tipo de datos
        console.log('Es un arreglo:', Array.isArray(data));

        if (Array.isArray(data)) {
          setPacientes(data);
          setPacientesFiltrados(data);
        } else {
          console.error('La respuesta de la API no es un arreglo');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los pacientes:', error);
        setLoading(false);
      });
  }, []);

  // Hook useEffect para aplicar filtros cada vez que cambian
  useEffect(() => {
    aplicarFiltros(); // Aplica filtros cada vez que cambian
  }, [filtros, nivelColesterolConocido]);

  // Función para manejar el cambio en el filtro de colesterol
  const manejarSeleccionColesterol = (e) => {
    const valor = e.target.value;
    setNivelColesterolConocido(valor);
    if (valor === 'no') {
      setFiltros(prev => ({
        ...prev,
        nivelColesterol: '', // Resetea el nivel de colesterol específico si se selecciona "no"
      }));
    }
  };

  // Función para manejar cambios en los filtros
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value || '', // Maneja el valor vacío como cadena vacía
    }));
  };

  // Función para obtener el nivel de colesterol basado en el valor
  const obtenerNivelColesterol = (valor) => {
    if (valor < 154) return 4;
    if (valor >= 155 && valor <= 192) return 5;
    if (valor >= 193 && valor <= 231) return 6;
    if (valor >= 232 && valor <= 269) return 7;
    return 8;
  };

  // Función para aplicar filtros a la lista de pacientes
  const aplicarFiltros = () => {
    const filtrados = pacientes.filter(paciente => {
      const edadFiltro = filtros.edad === '' ? null : filtros.edad;
      const cinturaFiltro = filtros.cintura === '' ? null : filtros.cintura;
      const presionArterialFiltro = filtros.presionArterial === '' ? null : filtros.presionArterial;
      const nivelColesterolFiltro = filtros.nivelColesterol === '' ? null : Number(filtros.nivelColesterol);

      const nivelColesterolPaciente = paciente.colesterol ? obtenerNivelColesterol(Number(paciente.colesterol)) : null;

      const imc = paciente.imc;
      const categoriaIMC = imc < 18.5 ? '<18.5' :
                           (imc >= 18.5 && imc <= 24.9) ? '18.5-24.9' :
                           (imc >= 25 && imc <= 29.9) ? '25-29.9' :
                           (imc >= 30 && imc <= 34.9) ? '30-34.9' :
                           (imc >= 35 && imc <= 39.9) ? '35-39.9' : '40+';
        // Filtrado por edad
        let edadValida = true;
        if (edadFiltro) {
          const [min, max] = edadFiltro.split('-').map(Number);
          if (isNaN(max)) {
            // Si max es NaN, significa que es el rango "71+"
            edadValida = paciente.edad > 71;
          } else {
            edadValida = paciente.edad >= min && paciente.edad <= (max || Number.MAX_VALUE);
          }
        }

        let cinturaValida = true;
        if (cinturaFiltro) {
          if (cinturaFiltro === "<88") {
            cinturaValida = paciente.cintura < 88;
          } else if (cinturaFiltro === "88+") {
            cinturaValida = paciente.cintura > 88;
          } else if (cinturaFiltro === "<102") {
            cinturaValida = paciente.cintura < 102;
          } else if (cinturaFiltro === "102+") {
            cinturaValida = paciente.cintura > 102;
          }
        }

        // Restante lógica de filtrado
        return (
          edadValida &&
          cinturaValida &&
          (filtros.genero === '' || (paciente.genero && paciente.genero.toLowerCase() === filtros.genero.toLowerCase())) &&
          (filtros.doctor === '' || (paciente.doctor && paciente.doctor.toLowerCase() === filtros.doctor.toLowerCase())) &&
          (filtros.diabetes === '' || (paciente.diabetes && paciente.diabetes.toLowerCase() === filtros.diabetes.toLowerCase())) &&
          (filtros.fumador === '' || (paciente.fumador && paciente.fumador.toLowerCase() === filtros.fumador.toLowerCase())) &&
          (filtros.exfumador === '' || (paciente.exfumador && paciente.exfumador.toLowerCase() === filtros.exfumador.toLowerCase())) &&
          (presionArterialFiltro === null || paciente.presionArterial.toString() === presionArterialFiltro) &&
          (
            nivelColesterolConocido === 'todos' || 
            (nivelColesterolConocido === 'no' && (paciente.colesterol === 'No' || paciente.colesterol === null)) || 
            (nivelColesterolConocido === 'si' && paciente.colesterol !== null && paciente.colesterol !== 'No' && (filtros.nivelColesterol === '' || nivelColesterolPaciente === nivelColesterolFiltro))
          ) &&
          (filtros.nivelRiesgo === '' || (paciente.nivelRiesgo && paciente.nivelRiesgo.toLowerCase() === filtros.nivelRiesgo.toLowerCase())) &&
          (filtros.ubicacion === '' || (paciente.ubicacion && paciente.ubicacion.toLowerCase() === filtros.ubicacion.toLowerCase())) &&
          (filtros.imc === '' || filtros.imc === categoriaIMC) &&
          (filtros.infarto === '' || (paciente.infarto && paciente.infarto.toLowerCase() === filtros.infarto.toLowerCase())) &&
          (filtros.acv === '' || (paciente.acv && paciente.acv.toLowerCase() === filtros.acv.toLowerCase())) &&
          (filtros.hipertenso === '' || (paciente.hipertenso && paciente.hipertenso.toLowerCase() === filtros.hipertenso.toLowerCase())) &&
          // Nuevos filtros
          (filtros.medicamentosHipertension === '' || (paciente.medicamentosHipertension && paciente.medicamentosHipertension.toLowerCase().includes(filtros.medicamentosHipertension.toLowerCase()))) &&
          (filtros.medicamentosDiabetes === '' || (paciente.medicamentosDiabetes && paciente.medicamentosDiabetes.toLowerCase().includes(filtros.medicamentosDiabetes.toLowerCase()))) &&
          (filtros.medicamentosColesterol === '' || (paciente.medicamentosColesterol && paciente.medicamentosColesterol.toLowerCase().includes(filtros.medicamentosColesterol.toLowerCase()))) &&
          (filtros.aspirina === '' || (paciente.aspirina && paciente.aspirina.toLowerCase() === filtros.aspirina.toLowerCase())) &&
          (filtros.tfg === '' || paciente.tfg === Number(filtros.tfg)) && // Assuming TFG is a number
          (filtros.numeroGestas === '' || paciente.numeroGestas === Number(filtros.numeroGestas)) &&
          (filtros.fum === '' || (paciente.fum && paciente.fum.toLowerCase() === filtros.fum.toLowerCase())) &&
          (filtros.metodoAnticonceptivo === '' || (paciente.metodoAnticonceptivo && paciente.metodoAnticonceptivo.toLowerCase().includes(filtros.metodoAnticonceptivo.toLowerCase()))) &&
          (filtros.trastornosHipertensivos === '' || (paciente.trastornosHipertensivos && paciente.trastornosHipertensivos.toLowerCase() === filtros.trastornosHipertensivos.toLowerCase())) &&
          (filtros.diabetesGestacional === '' || (paciente.diabetesGestacional && paciente.diabetesGestacional.toLowerCase() === filtros.diabetesGestacional.toLowerCase())) &&
          (filtros.sop === '' || (paciente.sop && paciente.sop.toLowerCase() === filtros.sop.toLowerCase())) &&
          (filtros.enfermedad === '' || (paciente.enfermedad && paciente.enfermedad.toLowerCase().includes(filtros.enfermedad.toLowerCase()))) &&
          (filtros.alergias === '' || (paciente.alergias && paciente.alergias.toLowerCase() === filtros.alergias.toLowerCase())) &&
          (filtros.tiroides === '' || (paciente.tiroides && paciente.tiroides.toLowerCase() === filtros.tiroides.toLowerCase())) &&
          (filtros.sedentarismo === '' || (paciente.sedentarismo && paciente.sedentarismo.toLowerCase() === filtros.sedentarismo.toLowerCase()))
        );
      });

    setPacientesFiltrados(filtrados);
  };

  // Función para eliminar un paciente
  const eliminarPaciente = (id) => {
    axios.delete(`${apiBaseURL}/api/pacientes/${id}`)
      .then(() => {
        setPacientes(pacientes.filter(paciente => paciente.id !== id));
        setPacientesFiltrados(pacientesFiltrados.filter(paciente => paciente.id !== id));
      })
      .catch(error => console.error('Error al eliminar el paciente:', error));
  };

  // Función para redirigir al usuario a la página de edición de un paciente
  const editarPaciente = (id) => {
    navigate(`/editar-paciente/${id}`);
  };

  // Función para obtener el color de riesgo basado en el nivel
  const obtenerColorRiesgo = (nivel) => {
    switch (nivel) {
      case 'Poco':
        return 'bg-green-100 text-green-800';
      case 'Moderado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alto':
        return 'bg-orange-100 text-orange-800';
      case 'Muy Alto':
        return 'bg-red-100 text-red-800';
      case 'Crítico':
        return 'bg-red-900 text-white';
      default:
        return '';
    }
  };

  const toggleGraficos = () => {
    setMostrarGraficos(prev => !prev);
  };

const copiarDatos = async (paciente) => {
  const apiBaseURL = 'https://rcv-daspu-production.up.railway.app';
  let datosCircuito = null;

  // 1. Buscamos al paciente en el circuito para obtener los datos técnicos
  try {
    const res = await axios.get(`${apiBaseURL}/api/circuito/listar`);
    datosCircuito = res.data.find(p => p.patientInfo?.dni === paciente.cuil);
  } catch (err) {
    console.error("No se pudieron recuperar datos de Circuito para el DNI:", paciente.cuil);
  }

  const nivelRiesgoTexto = paciente.nivelRiesgo;
  const recomendaciones = Advertencia[nivelRiesgoTexto] || "No hay recomendaciones disponibles.";
  
  // Referencias rápidas para los datos de Circuito
  const c = datosCircuito || {};
  const lb = c.laboratorio || {};
  const or = c.orina || {};
  const ap = c.antecedentesPersonales || {};
  const af = c.antecedentesFamiliares || {};

  // 2. Generamos el bloque de texto (Tus datos de Formulario + Los nuevos de Circuito)
  const datos = `
ID: ${paciente.id} FECHA DE REGISTRO: ${paciente.fechaRegistro} DNI: ${paciente.cuil} TELÉFONO: ${paciente.telefono} Edad: ${paciente.edad} Género: ${paciente.genero}
HIPERTENSO: ${paciente.hipertenso}
Medicamentos Hipertensión: ${paciente.medicamentosHipertension || 'N/A'}
Diabetes: ${paciente.diabetes}
Medicamentos Diabetes: ${paciente.medicamentosDiabetes || 'N/A'}
Fumador: ${paciente.fumador}
ExFumador: ${paciente.exfumador}

TA Máx.: ${paciente.presionArterial}
TA Mín.: ${paciente.taMin}
Colesterol: ${paciente.colesterol}

Medicamentos Colesterol: ${paciente.medicamentosColesterol || 'N/A'}

IMC: ${paciente.imc}
PESO: ${paciente.peso}
TALLA: ${paciente.talla}
CINTURA: ${paciente.cintura}

ACV: ${paciente.acv}
RENAL: ${paciente.renal}
PULMONAR: ${paciente.pulmonar}

ALERGIAS: ${paciente.alergias || 'N/A'}
TIROIDES: ${paciente.tiroides || 'N/A'}
SEDENTARISMO: ${paciente.sedentarismo || 'N/A'}
SUEÑO: ${paciente.sueño || 'N/A'}
INFARTO: ${paciente.infarto}

Nivel de Riesgo: ${nivelRiesgoTexto}
Aspirina: ${paciente.aspirina || 'N/A'}
TFG: ${paciente.tfg ? String(paciente.tfg).substring(0, 5) : 'N/A'} ml/min/1.73m²

${paciente.numeroGestas ? `Número de Gestas: ${paciente.numeroGestas}` : ""}
${paciente.fum ? `FUM: ${paciente.fum}` : ""}

ELECTROCARDIOGRAMA:
Ritmo sinusal, frecuencia cardíaca y eje normal, sin trastornos agudos del segmento ST y T, sin alteraciones en el sistema de conducción, sin arritmias, intervalo QT dentro de lo normal.

No refiere angor, disnea, palpitaciones, mareos ni edemas.

${paciente.metodoAnticonceptivo ? `Método Anticonceptivo: ${paciente.metodoAnticonceptivo}` : ""}
${paciente.trastornosHipertensivos ? `Trastornos Hipertensivos: ${paciente.trastornosHipertensivos}` : ""}
${paciente.diabetesGestacional ? `Diabetes Gestacional: ${paciente.diabetesGestacional}` : ""}
${paciente.sop ? `SOP: ${paciente.sop}` : ""}

--- COMPLEMENTO CIRCUITO (DATOS TÉCNICOS ADICIONALES) ---

ORIGEN TURNO: ${c.origenTurno || '--'} | ASISTIÓ: ${c.asistio ? 'SÍ' : 'NO'}
ÚLT. CONSULTA: ${c.ultimaConsulta || '--'}

A. PERSONALES EXTRA:
EPOC: ${ap.epoc ? 'SÍ' : 'NO'} | ICC: ${ap.icc ? 'SÍ' : 'NO'} | ASMA: ${ap.asma ? 'SÍ' : 'NO'}
ARTRITIS: ${ap.artritis ? 'SÍ' : 'NO'} | ANGINA: ${ap.anginaPecho ? 'SÍ' : 'NO'} | ICTUS: ${ap.ictus ? 'SÍ' : 'NO'}
MAMOGRAFÍA: ${ap.mamografiaFecha || '--'} | PAP/SOMF: ${ap.papSomfFecha || '--'} | ALBUMINURIA: ${ap.albuminuria || '--'}

A. FAMILIARES:
AF Diabetes: ${af.afDiabetes ? 'SÍ' : 'NO'} | AF HTA: ${af.afHipertension ? 'SÍ' : 'NO'}
AF Cardiopatía: ${af.afCardiopatia ? 'SÍ' : 'NO'} | AF ACV: ${af.afAcv ? 'SÍ' : 'NO'}
CÓDIGOS: ${af.afCodigos || '--'} | FAT/RES/DEA: ${af.fatResDeaPdp || '--'}

LABORATORIO HEMOGRAMA:
ERITROCITOS: ${lb.eritrocitos || '--'} | HEMOGLOBINA: ${lb.hemoglobina || '--'} | HEMATOCRITO: ${lb.hematocrito || '--'}
VCM: ${lb.vcm || '--'} | HCM: ${lb.hcm || '--'} | CHCM: ${lb.chcm || '--'} | RDW: ${lb.rdw || '--'}
LEUCOCITOS: ${lb.leucocitos || '--'} | NEUTRÓFILOS SEGM: ${lb.neutrofilosSegm || '--'}%
EOSINÓFILOS: ${lb.eosinofilos || '--'}% | BASÓFILOS: ${lb.basofilos || '--'}% | LINFOCITOS: ${lb.linfocitos || '--'}% GLUCEMIA: ${lb.glucemia || '--'} mg/dL | MONOCITOS: ${lb.monocitos || '--'}%
NEUTRÓFILOS ABS: ${lb.neutrofilosAbsoluto || '--'} | LINFOCITOS ABS: ${lb.linfocitosAbsoluto || '--'}

QUÍMICA Y ELECTROLITOS:
CREATININA: ${lb.creatinina || '--'} | TFG (CIRCUITO): ${lb.filtradoGlomerular || '--'}
SODIO: ${lb.sodio || '--'} | POTASIO: ${lb.potasio || '--'} | CLORO: ${lb.cloro || '--'}
HDL: ${lb.hdl || '--'} | LDL: ${lb.ldl || '--'} | TRIGLICÉRIDOS: ${lb.trigliceridos || '--'}

EXAMEN DE ORINA TÉCNICO:
COLOR: ${or.color || '--'} | ASPECTO: ${or.aspecto || '--'} | PH: ${or.ph || '--'} | DENSIDAD: ${or.densidad || '--'}
PROTEINURIA: ${or.proteinuria || '--'} | CREATININURIA: ${or.creatininuira || '--'} | REL. PROT/CREA: ${or.relacionProteinaCreatinina || '--'}
GLUCOSA: ${or.glucosa || '--'} | CETONAS: ${or.cetonas || '--'} | NITRITOS: ${or.nitritos || '--'}
LEUCOCITOS ORINA: ${or.leucocitosOrina || '--'} | HEMATÍES ORINA: ${or.hematiesOrina || '--'}

MEDICACIÓN CIRCUITO:
${c.medicacionActual?.length > 0 
  ? c.medicacionActual.map(m => `- ${m.descripcion}: ${m.dosis} (${m.posologia})`).join('\n')
  : 'No hay medicación cargada en el circuito.'}

ALERTAS CLÍNICAS CIRCUITO: ${c.evaluacion?.alertasClinicas || 'Ninguna'}

RECOMENDACIONES:
${recomendaciones}
--- CONDUCTA CLÍNICA ---

${paciente.sintomaAlarma ? `SÍNTOMAS DE ALARMA: ${paciente.sintomaAlarma}` : ""}
${paciente.interconsulta ? `INTERCONSULTA: ${paciente.interconsulta}` : ""}
${paciente.solicitarEstudios ? `SOLICITUD DE ESTUDIOS: ${paciente.solicitarEstudios}` : ""}
${paciente.cambioMedicacion ? `CAMBIO DE MEDICACIÓN: ${paciente.cambioMedicacion}` : ""}

--- OTROS ---

${paciente.consulta ? `CONSULTA: ${paciente.consulta}` : ""}
${paciente.practica ? `PRÁCTICA: ${paciente.practica}` : ""}
${paciente.hipertensionArterial ? `HIPERTENSIÓN ARTERIAL: ${paciente.hipertensionArterial}` : ""}
${paciente.medicacionPrescripcion ? `MEDICACIÓN PRESCRIPCIÓN: ${paciente.medicacionPrescripcion}` : ""}
${paciente.medicacionDispensa ? `MEDICACIÓN DISPENSA: ${paciente.medicacionDispensa}` : ""}
${paciente.tabaquismo ? `TABAQUISMO: ${paciente.tabaquismo}` : ""}
${paciente.laboratorio ? `LABORATORIO: ${paciente.laboratorio}` : ""}
  `;

  // 3. Copiar al portapapeles
  navigator.clipboard.writeText(datos.trim())
    .then(() => alert('Datos de Formulario + Circuito copiados correctamente.'))
    .catch(err => console.error('Error al copiar los datos:', err));
};

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de Pacientes</h1>
      
      <div className="mb-6">
      {/* Botón Mostrar/Ocultar */}
      <button
        onClick={toggleFiltros}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md shadow hover:bg-gray-300"
      >
        {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

      {/* Filtros visibles si mostrarFiltros es true */}
      {mostrarFiltros && (
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex-1">
            {/* Fila 1 */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Edad */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Edad</label>
                <select
                  name="edad"
                  value={filtros.edad || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="0-40">Menor o igual a 40</option>
                  <option value="41-50">Entre 41 y 50</option>
                  <option value="51-60">Entre 51 y 60</option>
                  <option value="61-70">Entre 61 y 70</option>
                  <option value="71+">Mayores de 71</option>
                </select>
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Género</label>
                <select
                  name="genero"
                  value={filtros.genero || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>

              {/* Diabetes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Diabetes?</label>
                <select
                  name="diabetes"
                  value={filtros.diabetes || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Fumador */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Fumador?</label>
                <select
                  name="fumador"
                  value={filtros.fumador || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Exfumador */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Exfumador?</label>
                <select
                  name="exfumador"
                  value={filtros.exfumador || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Tensión Máxima */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tensión Máxima</label>
                <select
                  name="presionArterial"
                  value={filtros.presionArterial || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="120">120</option>
                  <option value="140">140</option>
                  <option value="160">160</option>
                  <option value="180">180</option>
                </select>
              </div>

              {/* Colesterol */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Colesterol</label>
                <select
                  name="colesterol"
                  value={nivelColesterolConocido}
                  onChange={manejarSeleccionColesterol}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>

                {nivelColesterolConocido === 'si' && (
                  <select
                    name="nivelColesterol"
                    value={filtros.nivelColesterol || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Seleccione un Nivel</option>
                    <option value="4">Muy Bajo (&lt;154)</option>
                    <option value="5">Bajo (155 - 192)</option>
                    <option value="6">Moderado (193 - 231)</option>
                    <option value="7">Alto (232 - 269)</option>
                    <option value="8">Muy Alto (&gt;270)</option>
                  </select>
                )}
              </div>
            </div>

            {/* Fila 2 */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nivel de riesgo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nivel de Riesgo</label>
                <select
                  name="nivelRiesgo"
                  value={filtros.nivelRiesgo || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="<10% Bajo">Bajo</option>
                  <option value=">10% <20% Moderado">Moderado</option>
                  <option value=">20% <30% Alto">Alto</option>
                  <option value=">30% <40% Muy Alto">Muy Alto</option>
                  <option value=">40% Crítico">Crítico</option>
                </select>
              </div>

              {/* IMC */}
              <div>
                <label className="block text-sm font-medium text-gray-700">IMC</label>
                <select
                  name="imc"
                  value={filtros.imc || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="<18.5">Menor a 18.5</option>
                  <option value="18.5-24.9">Saludable</option>
                  <option value="25-29.9">Sobrepeso</option>
                  <option value="30-34.9">Obesidad 1</option>
                  <option value="35-39.9">Obesidad 2</option>
                  <option value="40+">Obesidad 3</option>
                </select>
              </div>

              {/* Infarto */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Infarto?</label>
                <select
                  name="infarto"
                  value={filtros.infarto || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* ACV */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿ACV?</label>
                <select
                  name="acv"
                  value={filtros.acv || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Hipertenso */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Hipertenso?</label>
                <select
                  name="hipertenso"
                  value={filtros.hipertenso || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Cintura */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Cintura</label>
                <select
                  name="cintura"
                  value={filtros.cintura || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="<88">Menor de 88</option>
                  <option value="88+">Mayor de 88</option>
                  <option value="<102">Menor de 102</option>
                  <option value="102+">Mayor de 102</option>
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  name="doctor"
                  value={filtros.doctor || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="doctor1">Doctor 1</option>
                  <option value="doctor2">Doctor 2</option>
                  <option value="doctor3">Doctor 3</option>
                </select>
              </div>

              {/* Aspirina */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Toma Aspirina?</label>
                <select
                  name="aspirina"
                  value={filtros.aspirina || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* TFG */}
              <div>
                <label className="block text-sm font-medium text-gray-700">TFG</label>
                <input
                  type="number"
                  name="tfg"
                  value={filtros.tfg || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Filtrar por TFG"
                />
              </div>

              {/* Enfermedad */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Enfermedad</label>
                <input
                  type="text"
                  name="enfermedad"
                  value={filtros.enfermedad || ''}
                  onChange={manejarCambio}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Filtrar por Enfermedad"
                />
              </div>

              {/* Alergias */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Alergias?</label>
                <select name="alergias" value={filtros.alergias || ''} onChange={manejarCambio} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Tiroides */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Tiroides?</label>
                <select name="tiroides" value={filtros.tiroides || ''} onChange={manejarCambio} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Sedentarismo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">¿Sedentarismo?</label>
                <select name="sedentarismo" value={filtros.sedentarismo || ''} onChange={manejarCambio} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                  <option value="">Todos</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Numero de Gestas (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Gestas</label>
                  <input
                    type="number"
                    name="numeroGestas"
                    value={filtros.numeroGestas || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Filtrar por Gestas"
                  />
                </div>
              )}

              {/* FUM (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">FUM</label>
                  <input
                    type="text" // Or date type if applicable
                    name="fum"
                    value={filtros.fum || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Filtrar por FUM"
                  />
                </div>
              )}

              {/* Metodo Anticonceptivo (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Método Anticonceptivo</label>
                  <input
                    type="text"
                    name="metodoAnticonceptivo"
                    value={filtros.metodoAnticonceptivo || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Filtrar por Método Anticonceptivo"
                  />
                </div>
              )}

              {/* Trastornos Hipertensivos (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trastornos Hipertensivos</label>
                  <select
                    name="trastornosHipertensivos"
                    value={filtros.trastornosHipertensivos || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

              {/* Diabetes Gestacional (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diabetes Gestacional</label>
                  <select
                    name="diabetesGestacional"
                    value={filtros.diabetesGestacional || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

              {/* SOP (Femenino) */}
              {filtros.genero === 'Femenino' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">SOP</label>
                  <select
                    name="sop"
                    value={filtros.sop || ''}
                    onChange={manejarCambio}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

            </div>

            {/* Botón aplicar filtros */}
            <button
              onClick={aplicarFiltros}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700"
            >
              Aplicar Filtros
            </button>
          </div>
          </div>
        )}
      </div>

      {/* Gráficos */}
      {/* Pestaña para los gráficos */}
      <button 
        onClick={toggleGraficos} 
        className="bg-indigo-600 text-white p-2 rounded"
      >
        {mostrarGraficos ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
      </button>

      {/* Mostrar los gráficos si el estado es verdadero */}
      {mostrarGraficos && (
        <div className="mt-4">
          <EstadisticasGraficos pacientesFiltrados={pacientesFiltrados} />
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Total de Personas que Coinciden con los Filtros: {pacientesFiltrados.length}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pacientesFiltrados.slice().reverse().map(paciente => ( // Aquí usamos slice() para no mutar el array original
        <div key={paciente.id} className="bg-white shadow-md rounded-lg p-4">
          {/* Datos siempre visibles */}
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">ID:</div>
            <div className="text-sm text-gray-500">{paciente.id}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Edad:</div>
            <div className="text-sm text-gray-500">{paciente.edad}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">TELEFONO:</div>
            <div className="text-sm text-gray-500">{paciente.telefono}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">GÉNERO:</div>
            <div className="text-sm text-gray-500">{paciente.genero}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">DNI:</div>
            <div className="text-sm text-gray-500">{paciente.cuil}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">TA Máx.:</div>
            <div className="text-sm text-gray-500">{paciente.presionArterial}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">TA Mín.:</div>
            <div className="text-sm text-gray-500">{paciente.taMin}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Peso:</div>
            <div className="text-sm text-gray-500">{paciente.peso}</div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-gray-900">Talla:</div>
            <div className="text-sm text-gray-500">{paciente.talla}</div>
          </div>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm font-medium text-gray-900">Nivel de Riesgo:</div>
            <div className="text-sm text-gray-500">
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${obtenerColorRiesgo(paciente.nivelRiesgo)}`}>
                {paciente.nivelRiesgo}
              </span>
            </div>
          </div>

          {/* Mostrar detalles adicionales super completos (Formulario + Circuito) */}
          {mostrarDetalles[paciente.id] && (() => {
            // NOTA: Para que los datos del circuito se vean aquí, debes tenerlos vinculados al paciente en tu estado.
            // Si los trajiste en el useEffect general, asumo que están en paciente.circuito o algo similar.
            // Si no están, el código no fallará (mostrará lo del form), pero para ver todo usa:
            const ModalDetallesPaciente = ({ paciente, circuito, onClose }) => {
              if (!paciente) return null;

              // Referencias rápidas
              const c = circuito || {};
              const ap = c.antecedentesPersonales || {};
              const af = c.antecedentesFamiliares || {};
              const lb = c.laboratorio || {};
              const or = c.orina || {};

              const SectionTitle = ({ children, icon }) => (
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-indigo-500 pb-1 w-fit">
                  <span className="text-indigo-600">{icon}</span>
                  {children}
                </h3>
              );

              const DataField = ({ label, value, highlight = false }) => {
                if (value === null || value === undefined || value === '' || value === 'N/A') return null;
                return (
                  <div className={`p-3 rounded-lg ${highlight ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50 border border-gray-100'}`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
                    <p className={`text-sm font-semibold ${highlight ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {typeof value === 'boolean' ? (value ? 'SÍ' : 'NO') : value}
                    </p>
                  </div>
                );
              };

              return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                  <div className="bg-white w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                    
                    {/* HEADER: Identificación Rápida */}
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black">{paciente.nombre || "Ficha del Paciente"}</h2>
                          <span className="bg-indigo-500 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            ID: {paciente.id}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${paciente.nivelRiesgo === 'Alto' ? 'bg-red-500' : 'bg-green-500'}`}>
                            Riesgo: {paciente.nivelRiesgo}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 tracking-wide">
                          DNI: {paciente.cuil} | Edad: {paciente.edad} | Género: {paciente.genero} | Registro: {paciente.fechaRegistro}
                        </p>
                      </div>
                      <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    {/* CUERPO DEL MODAL (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                      <div className="grid grid-cols-12 gap-8">
                        
                        {/* COLUMNA IZQUIERDA: Constantes y RCV */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">
                          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <SectionTitle icon="🩺">Datos Clínicos Base</SectionTitle>
                            <div className="grid grid-cols-2 gap-3">
                              <DataField label="TA Máx/Mín" value={`${paciente.presionArterial} / ${paciente.taMin}`} highlight />
                              <DataField label="TFG (Filtro)" value={paciente.tfg} highlight />
                              <DataField label="IMC" value={paciente.imc} />
                              <DataField label="Peso/Talla" value={`${paciente.peso}kg / ${paciente.talla}cm`} />
                              <DataField label="Cintura" value={paciente.cintura} />
                              <DataField label="Colesterol" value={paciente.colesterol} />
                            </div>
                          </section>

                          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <SectionTitle icon="🚬">Hábitos y Estilo de Vida</SectionTitle>
                            <div className="grid grid-cols-2 gap-3">
                              <DataField label="Fumador" value={paciente.fumador} />
                              <DataField label="Ex-Fumador" value={paciente.exfumador} />
                              <DataField label="Sedentarismo" value={paciente.sedentarismo} />
                              <DataField label="Sueño" value={paciente.sueño} />
                              <DataField label="Alergias" value={paciente.alergias} />
                              <DataField label="Tiroides" value={paciente.tiroides} />
                            </div>
                          </section>

                          {paciente.genero === 'F' && (
                            <section className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
                              <SectionTitle icon="♀️">Salud Femenina</SectionTitle>
                              <div className="grid grid-cols-2 gap-3">
                                <DataField label="Gestas" value={paciente.numeroGestas} />
                                <DataField label="FUM" value={paciente.fum} />
                                <DataField label="Anticonceptivo" value={paciente.metodoAnticonceptivo} />
                                <DataField label="Trast. HTA" value={paciente.trastornosHipertensivos} />
                              </div>
                            </section>
                          )}
                        </div>

                        {/* COLUMNA CENTRAL: Complemento Circuito */}
                        <div className="col-span-12 lg:col-span-5 space-y-6">
                          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <SectionTitle icon="🔬">Laboratorio (Circuito)</SectionTitle>
                            <div className="space-y-4">
                              <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">Hemograma y Química</p>
                                <div className="grid grid-cols-3 gap-4">
                                  <DataField label="Hb" value={lb.hemoglobina} />
                                  <DataField label="Hto" value={lb.hematocrito} />
                                  <DataField label="Glucemia" value={lb.glucemia} />
                                  <DataField label="Creatinina" value={lb.creatinina} />
                                  <DataField label="HDL" value={lb.hdl} />
                                  <DataField label="LDL" value={lb.ldl} />
                                </div>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">Examen de Orina</p>
                                <div className="grid grid-cols-2 gap-4">
                                  <DataField label="Prot/Crea" value={or.relacionProteinaCreatinina} />
                                  <DataField label="Densidad" value={or.densidad} />
                                  <DataField label="Glucosa" value={or.glucosa} />
                                  <DataField label="Leucocitos" value={or.leucocitosOrina} />
                                </div>
                              </div>
                            </div>
                          </section>

                          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <SectionTitle icon="💊">Medicación Actual</SectionTitle>
                            <div className="grid grid-cols-1 gap-3">
                              <DataField label="Medic. Hipertensión" value={paciente.medicamentosHipertension} />
                              <DataField label="Medic. Diabetes" value={paciente.medicamentosDiabetes} />
                              {c.medicacionActual?.map((m, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                                  <div>
                                    <p className="text-sm font-bold text-indigo-900">{m.descripcion}</p>
                                    <p className="text-[10px] text-indigo-600">{m.dosis} - {m.posologia}</p>
                                  </div>
                                  <span className="text-[10px] font-black text-indigo-300">CIRCUITO</span>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>

                        {/* COLUMNA DERECHA: Antecedentes y Conducta */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                          <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
                            <SectionTitle icon="⚠️">Antecedentes</SectionTitle>
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { l: 'HTA', v: paciente.hipertenso }, { l: 'DBT', v: paciente.diabetes },
                                  { l: 'ACV', v: paciente.acv }, { l: 'INFARTO', v: paciente.infarto },
                                  { l: 'ICC', v: ap.icc }, { l: 'EPOC', v: ap.epoc }
                                ].map(ant => ant.v && (
                                  <span key={ant.l} className="px-2 py-1 bg-red-600 text-white text-[10px] font-black rounded shadow-sm">
                                    {ant.l}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-4">
                                <DataField label="AF Diabetes" value={af.afDiabetes} />
                                <DataField label="AF HTA" value={af.afHipertension} />
                              </div>
                            </div>
                          </section>

                          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <SectionTitle icon="📝">Conducta Clínica</SectionTitle>
                            <div className="space-y-3">
                              <DataField label="Síntomas Alarma" value={paciente.sintomaAlarma} />
                              <DataField label="Interconsulta" value={paciente.interconsulta} />
                              <DataField label="Cambio Medicación" value={paciente.cambioMedicacion} />
                              <DataField label="Solicitud Estudios" value={paciente.solicitarEstudios} />
                            </div>
                          </section>

                          <div className="bg-slate-900 p-6 rounded-2xl text-white">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Alertas de Circuito</p>
                            <p className="text-xs italic leading-relaxed text-slate-200">
                              {c.evaluacion?.alertasClinicas || "No se registran alertas clínicas de urgencia en el sistema."}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* FOOTER: Acciones rápidas */}
                    <div className="bg-white border-t border-slate-200 p-6 flex justify-end gap-4">
                      <button onClick={onClose} className="px-6 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        Cerrar Ficha
                      </button>
                      <button 
                        onClick={() => window.print()} 
                        className="px-6 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-black transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Imprimir Reporte
                      </button>
                    </div>

                  </div>
                </div>
              );
            };
                      })()}

          {/* Botón "Mostrar más" o "Mostrar menos" */}
          <button onClick={() => toggleDetalles(paciente.id)} className="text-indigo-600 hover:text-indigo-900 mt-2">
            {mostrarDetalles[paciente.id] ? 'Mostrar menos' : 'Mostrar más'}
          </button>

          <div className="flex justify-end mt-4">
            <button onClick={() => editarPaciente(paciente.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
              Editar
            </button>
            <button onClick={() => eliminarPaciente(paciente.id)} className="text-red-600 hover:text-red-900 mr-4">
              Eliminar
            </button>
            <button onClick={() => copiarDatos(paciente)} className="text-blue-600 hover:text-blue-900">
              Copiar
            </button>
          </div>
        </div>
      ))}
    </div>

    </div>
);
}

export default Estadisticas;