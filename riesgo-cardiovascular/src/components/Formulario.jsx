import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { calcularRiesgoCardiovascular } from './Calculadora';
import { Advertencia, DatosPacienteInicial, obtenerColorRiesgo, obtenerTextoRiesgo,listaNotificacionRiesgo, listaConsulta, listaPractica, listaHipertensionArterial, listaMedicacionPrescripcion, listaMedicacionDispensa, listaTabaquismo, listaLaboratorio } from './ConstFormulario';
import { getLocations } from '../services/userService';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

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
  "Clínica médica",
  "Endocrinología",
  "Ginecología",
  "Urología",
  "Psiquiatría",
  "Nutrición",
  "Neumonología",
  "Hematología",
  "Oftalmología",
  "Otro"
];

const listaSolicitarEstudios = [
  "Ecocardiograma",
  "Ergometría",
  "Holter",
  "Mapeo",
  "Eco Doppler de vasos de cuello",
  "Eco Doppler de miembros inferiores",
  "Ecografía abdominal",
  "Telerradiografía de tórax",
  "Perfusión miocárdica",
  "Cateterismo cardíaco",
  "Laboratorio ampliado",
  "Fondo de ojos",
  "Otro"
];

const listaCambioMedicacion = [
  "Agrego",
  "Aumento",
  "Suspendo",
  "Reduzco",
  "Otro"
];

// Lista de medicamentos para la hipertensión
const listaMedicamentosHipertension = [
    "Enalapril 10 mg cada 12 Hs",
    "Enalapril 5 mg cada 12 Hs",
    "Losartan 25 mg cada 12 Hs",
    "Losartan 50 mg cada 12 Hs",
    "Amlodipina 10 mg cada12 Hs",
    "Amlodipina 5 mg cada12 Hs",
    "Hidroclorotiazida 25 mg cada 12 Hs",
    "Furosemida 20 mg cada 12 Hs",
    "Valsartán 160 mg cada 12 Hs",
    "Valsartán 80 mg cada 12 Hs",
    "Carvedilol 25 mg cada 12 Hs",
    "Carvedilol 12,5 mg cada 12 Hs",
    "Bisoprolol 5 mg cada 12 Hs",
    "Bisoprolol 2,5 mg cada 12 Hs",
    "Nebivolol 10 mg por día",
    "Nebivolol 5 mg por día",
    "Espironolactona 25 mg por día",
    "Otros"
];

const listaMedicamentosDiabetes = [
    "Metformina 500 mg dos por dia", "Metformina 850 mg dos por dia",
    "Metformina 1000 mg dos por dia", "Otra"
];

const listaMedicamentosColesterol = [
    "Atorvastatina 10 mg uno por día", "Atorvastatina 20 mg uno por día", "Atorvastatina 40 mg uno por día",
    "Atorvastatina 80 mg uno por día", "Rosuvastatina 5 mg uno por día", "Rosuvastatina 10 mg uno por día",
    "Rosuvastatina 20 mg uno por día", "Rosuastatina 40 mg uno por día", "Otra"
];

const Formulario = () => {
    const location = useLocation();
    
    // 1. Initialize state. We don't overwrite it immediately.
    const [datosPaciente, setDatosPaciente] = useState({
        ...DatosPacienteInicial,
        numeroGestas: '',
        fum: '',
        metodoAnticonceptivo: '',
        trastornosHipertensivos: '',
        diabetesGestacional: '',
        sop: '', 
        medicamentosHipertension: '', 
        medicamentosDiabetes: '',
        medicamentosColesterol: '',
    });

    const [nivelColesterolConocido, setNivelColesterolConocido] = useState(null);
    const [nivelRiesgo, setNivelRiesgo] = useState(null);
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalAdvertencia, setModalAdvertencia] = useState(null);
    const [mostrarModalMedicamentos, setMostrarModalMedicamentos] = useState(false);
    const [medicamentosSeleccionados, setMedicamentosSeleccionados] = useState({
        notificacionRiesgo: [], consulta: [], practica: [], hipertensionArterial: [],
        medicacionPrescripcion: [], medicacionDispensa: [], tabaquismo: [], laboratorio: [],
    });
    const [otroMedicamentoHipertension, setOtroMedicamentoHipertension] = useState("");
    const [otroMedicamentoDiabetes, setOtroMedicamentoDiabetes] = useState("");
    const [otroMedicamentoColesterol, setOtroMedicamentoColesterol] = useState("");
    const [medicamentosHipertensionSeleccionados, setMedicamentosHipertensionSeleccionados] = useState([]);
    const [medicamentosDiabetesSeleccionados, setMedicamentosDiabetesSeleccionados] = useState([]);
    const [medicamentosColesterolSeleccionados, setMedicamentosColesterolSeleccionados] = useState([]);
    const [mensajeExito, setMensajeExito] = useState('');
    const [ubicaciones, setUbicaciones] = useState([]);
    const { user, roles } = useAuth(); 
    const [mostrarRenal, setMostrarRenal] = useState(false);
    const [creatinina, setCreatinina] = useState('');
    const [tfg, setTfg] = useState(null);
    const [otrosClinicos, setOtrosClinicos] = useState({
        sintomaAlarmaOtro: '', interconsultaOtro: '', solicitarEstudiosOtro: '',
        cambioMedicacionOtro: '', cambioAgrego: '', cambioAumento: '',
        cambioSuspendo: '', cambioReduzco: ''
    });

    const [seleccionesClinicas, setSeleccionesClinicas] = useState({
        sintomaAlarma: [], interconsulta: [], solicitarEstudios: [], cambioMedicacion: []
    });

    const today = new Date().toISOString().split('T')[0];

    const handleClinicoChange = (categoria, value, checked) => {
      setSeleccionesClinicas(prev => {
        const actual = prev[categoria];
        const updated = checked ? [...actual, value] : actual.filter(v => v !== value);
        return { ...prev, [categoria]: updated };
      });
    };

    useEffect(() => {
        // Debugging: Log what location.state contains
        console.log("Incoming Location State:", location.state);

        if (location.state && location.state.pacienteSeleccionado) {
            const p = location.state.pacienteSeleccionado;
            console.log("Patient Data Detected:", p); // Debugging

            const info = p.patientInfo || {};
            const fisico = p.examenFisico || {};
            const lab = p.laboratorio || {};
            const ant = p.antecedentesPersonales || {};
            const medLista = p.medicacionActual || [];

            let edadCalculada = "";
            if (info.fechaNacimiento) {
                const birthDate = new Date(info.fechaNacimiento);
                const hoy = new Date();
                edadCalculada = hoy.getFullYear() - birthDate.getFullYear();
                if (hoy.getMonth() < birthDate.getMonth() || (hoy.getMonth() === birthDate.getMonth() && hoy.getDate() < birthDate.getDate())) {
                    edadCalculada--;
                }
            }

            let sistolica = "";
            let diastolica = "";
            if (fisico.tensionArterial && fisico.tensionArterial.includes('/')) {
                const partes = fisico.tensionArterial.split('/');
                sistolica = partes[0].trim();
                diastolica = partes[1].trim();
            }

            const nombresMeds = medLista.map(m => `${m.descripcion} ${m.dosis}`);
            
            if (ant.hipertension) setMedicamentosHipertensionSeleccionados(nombresMeds);
            if (ant.diabetes) setMedicamentosDiabetesSeleccionados(nombresMeds);
            if (ant.dislipidemia) setMedicamentosColesterolSeleccionados(nombresMeds);

            // Construct the updated object FIRST
            const updatedData = {
                ...datosPaciente, // Keep defaults
                cuil: info.dni || '',
                telefono: info.telefono || '',
                genero: info.sexo === 'M' ? 'masculino' : info.sexo === 'F' ? 'femenino' : '', 
                edad: edadCalculada.toString() || '',
                peso: fisico.peso ? fisico.peso.toString() : '',
                talla: fisico.talla ? (fisico.talla * 100).toString() : '',
                cintura: fisico.contornoAbdominal ? fisico.contornoAbdominal.toString() : '',
                imc: fisico.imc ? fisico.imc.toString() : '',
                presionArterial: sistolica || '',
                taMin: diastolica || '',
                hipertenso: ant.hipertension ? 'Sí' : 'No', 
                diabetes: ant.diabetes ? 'Sí' : 'No',
                medicolesterol: (ant.dislipidemia || lab.colesterolTotal > 0) ? 'Sí' : 'No',
                colesterol: lab.colesterolTotal ? lab.colesterolTotal.toString() : '',
                infarto: ant.ataqueCardiaco ? 'Sí' : 'No',
                acv: ant.ictus ? 'Sí' : 'No',
                renal: ant.enfermedadRenal ? 'Sí' : 'No',
                enfermedad: ant.ecv ? 'Sí' : 'No', 
                tfg: lab.filtradoGlomerular ? lab.filtradoGlomerular.toString() : '',
                metodoAnticonceptivo: info.sexo === 'F' ? (ant.mamografiaFecha || '') : '',
            };

            console.log("Setting datosPaciente to:", updatedData); // Debugging
            setDatosPaciente(updatedData);

            if (lab.colesterolTotal > 0) {
                setNivelColesterolConocido(true);
            }
        } else {
             console.log("No patient data found in location.state.");
        }
    }, [location.state]);
    
    useEffect(() => {
        alert("Contenido de state: " + JSON.stringify(location.state));
    }, [location]);

    useEffect(() => {
        if (!creatinina || isNaN(creatinina) || !datosPaciente.edad || !datosPaciente.genero) {
            setTfg(null);
            return;
        }

        const edad = Number(datosPaciente.edad);
        const cr = parseFloat(creatinina);
        let resultado = null;

        if (datosPaciente.genero === 'femenino') {
            if (cr <= 0.7) {
                resultado = 144 * Math.pow(cr / 0.7, -0.329) * Math.pow(0.993, edad);
            } else {
                resultado = 144 * Math.pow(cr / 0.7, -1.209) * Math.pow(0.993, edad);
            }
        } else {
            if (cr <= 0.9) {
                resultado = 141 * Math.pow(cr / 0.9, -0.411) * Math.pow(0.993, edad);
            } else {
                resultado = 141 * Math.pow(cr / 0.9, -1.209) * Math.pow(0.993, edad);
            }
        }

        setTfg(resultado);
    }, [creatinina, datosPaciente]);

        
    useEffect(() => {
        const fetchUbicaciones = async () => {
            const ubicacionesData = await getLocations();
            setUbicaciones(ubicacionesData);
        };

        fetchUbicaciones();
    }, []);

    // Efecto para actualizar el campo de texto en datosPaciente cuando cambian los checkboxes
    useEffect(() => {
        setDatosPaciente(prev => ({
            ...prev,
            medicamentosHipertension: medicamentosHipertensionSeleccionados.join('; ')
        }));
    }, [medicamentosHipertensionSeleccionados]);
    
    useEffect(() => {
        setDatosPaciente(prev => ({
            ...prev,
            medicamentosDiabetes: medicamentosDiabetesSeleccionados.join('; ')
        }));
    }, [medicamentosDiabetesSeleccionados]);

    useEffect(() => {
        setDatosPaciente(prev => ({
            ...prev,
            medicamentosColesterol: medicamentosColesterolSeleccionados.join('; ')
        }));
    }, [medicamentosColesterolSeleccionados]);


    const validarCuil = (cuil) => {
        const soloNumeros = /^\d+$/; // Expresión regular para solo números

        if (cuil.length > 0 && cuil.length < 7) {
            setError('El CUIL o DNI debe tener al menos 7 dígitos y contener solo números.');
        } else if (cuil.length >= 7 && !soloNumeros.test(cuil)) {
            setError('El CUIL o DNI debe contener solo números.');
        } else {
            setError('');
        }
    };

    useEffect(() => {
        // Asignar la ubicación del usuario al estado inicial si es un usuario normal
        if (user && user.ubicacion) {
            setDatosPaciente(prevState => ({
                ...prevState,
                ubicacion: user.ubicacion.nombre // Asegúrate de que esté usando el nombre correcto
            }));
        }
    }, [user]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosPaciente({
            ...datosPaciente,
            [name]: value,
        });
        if (name === 'cuil') {
            validarCuil(value);
        }
    };

    const handleHipertensionMedChange = (e) => {
        const { value, checked } = e.target;
        setMedicamentosHipertensionSeleccionados(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(med => med !== value);
            }
        });
    };

    const handleDiabetesMedChange = (e) => {
        const { value, checked } = e.target;
        setMedicamentosDiabetesSeleccionados(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(med => med !== value);
            }
        });
    };

    const handleColesterolMedChange = (e) => {
        const { value, checked } = e.target;
        setMedicamentosColesterolSeleccionados(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(med => med !== value);
            }
        });
    };

    const manejarSeleccionColesterol = (value) => {
        setNivelColesterolConocido(value === 'si');
        setDatosPaciente({
            ...datosPaciente,
            colesterol: value === 'no' ? 'No' : datosPaciente.colesterol
        });
    };

    const calcularIMC = () => {
        const peso = parseFloat(datosPaciente.peso);
        const tallaCm = parseFloat(datosPaciente.talla);
        if (peso && tallaCm) {
            const tallaM = tallaCm / 100; // Convertir centímetros a metros
            const imc = peso / (tallaM * tallaM);
            return imc.toFixed(2);
        }
        return '';
    };

    const ajustarEdad = (edad) => {
        if (edad < 50) return 40;
        if (edad >= 50 && edad <= 59) return 50;
        if (edad >= 60 && edad <= 69) return 60;
        return 70;
    };

    const ajustarPresionArterial = (presion) => {
        if (presion < 140) return 120;
        if (presion >= 140 && presion <= 159) return 140;
        if (presion >= 160 && presion <= 179) return 160;
        return 180;
    };

    const validarCampos = () => {
        const {
            edad,
            genero,
            cuil,
            diabetes,
            fumador,
            exfumador,
            presionArterial,
            infarto,
            acv,
            renal,
            pulmonar
        } = datosPaciente;
    
        if (!edad || !genero || !cuil || !diabetes || !fumador || !exfumador || !presionArterial || !infarto || !acv || !renal || !pulmonar) {
            setError('Por favor, complete todos los campos obligatorios.');
            return false;
        }
        if (cuil.length < 7) {
            setError('El CUIL debe tener al menos 7 dígitos.');
            return false;
        }
        if (edad < 1 || edad > 120) {
            setError('La edad debe estar entre 1 y 120 años.');
            return false;
        }
        if (presionArterial < 50 || presionArterial > 250) {
            setError('La tensión arterial debe estar entre 60 y 250.');
            return false;
        }
        
    
        setError('');
        return true;
    };

    const calcularRiesgo = async () => {
        if (!validarCampos()) {
            setModalAdvertencia('Todos los campos deben estar completos.');
            setMostrarModal(true);
            return;
        }
    
        if (nivelColesterolConocido && !datosPaciente.colesterol) {
            setModalAdvertencia('Debe ingresar el nivel de colesterol.');
            setMostrarModal(true);
            return;
        }
    
        const { edad, genero, diabetes, fumador, exfumador, presionArterial, colesterol, enfermedad, infarto, acv, renal } = datosPaciente;
    
        if (enfermedad === "Sí" ||infarto === "Sí" || acv === "Sí" || renal === "Sí" || diabetes === "Sí") {
            setNivelRiesgo(">20% <30% Alto");
            setMostrarModal(true);
            return;
        }
    
        const edadAjustada = ajustarEdad(parseInt(edad, 10));
        const presionAjustada = ajustarPresionArterial(parseInt(presionArterial, 10));
        const imc = calcularIMC();
        setDatosPaciente((prevDatos) => ({ ...prevDatos, imc }));
    
        const riesgoCalculado = calcularRiesgoCardiovascular(edadAjustada, genero, diabetes, fumador, presionAjustada, colesterol);
        setNivelRiesgo(riesgoCalculado);
        setMostrarModal(true);
    };    

    const formatearDataClinica = (listaBotones, textoManual) => {
    // Filtramos "Otro" y "Ninguno" para que no aparezcan como texto
    const filtrados = listaBotones.filter(v => v !== "Otro" && v !== "Ninguno");
    
    // Si hay texto escrito en el input manual, lo agregamos a la lista
    if (textoManual && textoManual.trim() !== "") {
        filtrados.push(textoManual.trim());
    }
    
    return filtrados.join('; ');
    };
    const formatearCambioMedicacion = () => {
    const cambios = [];
    if (seleccionesClinicas.cambioMedicacion.includes("Agrego")) cambios.push(`Agregó: ${otrosClinicos.cambioAgrego}`);
    if (seleccionesClinicas.cambioMedicacion.includes("Aumento")) cambios.push(`Aumentó: ${otrosClinicos.cambioAumento}`);
    if (seleccionesClinicas.cambioMedicacion.includes("Suspendo")) cambios.push(`Suspendió: ${otrosClinicos.cambioSuspendo}`);
    if (seleccionesClinicas.cambioMedicacion.includes("Reduzco")) cambios.push(`Redujo: ${otrosClinicos.cambioReduzco}`);
    if (seleccionesClinicas.cambioMedicacion.includes("Otro")) cambios.push(`Otro: ${otrosClinicos.cambioMedicacionOtro}`);
    
    return cambios.join('; ');
    };
    // 4. Función de guardado actualizada
    const guardarPaciente = async () => {
    try {
        // --- Lógica Especial para Cambio de Medicación ---
        const listaCambios = [];
        if (seleccionesClinicas.cambioMedicacion.includes("Agrego")) 
            listaCambios.push(`Agregó: ${otrosClinicos.cambioAgrego || '(sin especificar)'}`);
        
        if (seleccionesClinicas.cambioMedicacion.includes("Aumento")) 
            listaCambios.push(`Aumentó: ${otrosClinicos.cambioAumento || '(sin especificar)'}`);
        
        if (seleccionesClinicas.cambioMedicacion.includes("Suspendo")) 
            listaCambios.push(`Suspendió: ${otrosClinicos.cambioSuspendo || '(sin especificar)'}`);
        
        if (seleccionesClinicas.cambioMedicacion.includes("Reduzco")) 
            listaCambios.push(`Redujo: ${otrosClinicos.cambioReduzco || '(sin especificar)'}`);
            
        if (seleccionesClinicas.cambioMedicacion.includes("Otro")) 
            listaCambios.push(`Otro cambio: ${otrosClinicos.cambioMedicacionOtro || '(sin especificar)'}`);

        const payload = {
            ...datosPaciente,
            nivelRiesgo,
            tfg,
            // Formateo normal para estos tres:
            sintomaAlarma: formatearDataClinica(seleccionesClinicas.sintomaAlarma, otrosClinicos.sintomaAlarmaOtro),
            interconsulta: formatearDataClinica(seleccionesClinicas.interconsulta, otrosClinicos.interconsultaOtro),
            solicitarEstudios: formatearDataClinica(seleccionesClinicas.solicitarEstudios, otrosClinicos.solicitarEstudiosOtro),
            
            // Formateo especial para medicación:
            cambioMedicacion: listaCambios.join('; ') 
        };

        console.log("Payload a enviar:", payload); // Para que verifiques en consola

        await axiosInstance.post('/api/pacientes', payload);
        setMensajeExito('Paciente guardado con éxito');
        setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
        console.error('Error al guardar:', error);
        setModalAdvertencia('Error al guardar los datos.');
        setMostrarModal(true);
    }
};
    
    const toggleModalMedicamentos = () => {
        setMostrarModalMedicamentos(!mostrarModalMedicamentos);
    };

    const handleMedicamentoChange = (categoria, evento) => {
        const { value, checked } = evento.target;
        setMedicamentosSeleccionados((prevSeleccionados) => {
            const nuevosSeleccionados = checked
                ? [...prevSeleccionados[categoria], value]
                : prevSeleccionados[categoria].filter((med) => med !== value);
            return {
                ...prevSeleccionados,
                [categoria]: nuevosSeleccionados,
            };
        });
    };

    const guardarMedicamentos = () => {
        const nuevosDatosPaciente = {
            ...datosPaciente,
            notificacionRiesgo: medicamentosSeleccionados.notificacionRiesgo.join('; '),
            consulta: medicamentosSeleccionados.consulta.join('; '),
            practica: medicamentosSeleccionados.practica.join('; '),
            hipertensionArterial: medicamentosSeleccionados.hipertensionArterial.join('; '),
            medicacionPrescripcion: medicamentosSeleccionados.medicacionPrescripcion.join('; '),
            medicacionDispensa: medicamentosSeleccionados.medicacionDispensa.join('; '),
            tabaquismo: medicamentosSeleccionados.tabaquismo.join('; '),
            laboratorio: medicamentosSeleccionados.laboratorio.join('; '),
        };
        setDatosPaciente(nuevosDatosPaciente);
        setMensajeExito('Medicamentos guardados con éxito');
        toggleModalMedicamentos(); // Cerrar el modal
    };
    
    const cerrarModal = () => {
        setMostrarModal(false);
        setMostrarModalMedicamentos(false);
        setModalAdvertencia(null);
    };
    
    const abrirModalAdvertencia = (nivel) => {
        setModalAdvertencia(Advertencia[nivel]);
    };
    
    const renderRiesgoGrid = (riesgo) => {
        const riesgos = [
            '<10% Bajo',
            '>10% <20% Moderado',
            '>20% <30% Alto',
            '>30% <40% Muy Alto',
            '>40% Crítico'
        ];
        return (
            <div className="grid grid-cols-12 gap-2">
                {riesgos.map((nivel) => (
                    <React.Fragment key={nivel}>
                        <div className={`col-span-4 ${obtenerColorRiesgo(nivel)}`}></div>
                        <div
                            className={`col-span-8 ${riesgo === nivel ? obtenerColorRiesgo(nivel) : 'bg-gray-300'} p-2 cursor-pointer`}
                            onClick={() => abrirModalAdvertencia(nivel)}
                        >
                            <span className={`${riesgo === nivel ? 'text-white' : 'text-gray-600'}`}>{obtenerTextoRiesgo(nivel)}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            <form className="w-full space-y-6">
                <h1 className="text-3xl font-bold mb-6">Formulario de Evaluación de Riesgo Cardiovascular</h1>
                
                {/* Cuil */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">DNI:</label>
                    <input
                        type="text"
                        name="cuil"
                        value={datosPaciente.cuil}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        style={{ appearance: 'none' }}
                    />
                </div>

                {/* Telefono */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Teléfono:</label>
                    <input
                        type="number"
                        name="telefono"
                        value={datosPaciente.telefono}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Género */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Género:</label>
                    <div className="flex space-x-2">
                        {['masculino', 'femenino'].map(option => (
                            <button
                                key={option}
                                type="button"
                                className={`p-2 border rounded ${datosPaciente.genero === option ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, genero: option }))}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CAMPOS CONDICIONALES PARA GÉNERO FEMENINO */}
                {datosPaciente.genero === 'femenino' && (
                    <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 space-y-4 rounded-r-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Información Adicional</h3>
                        
                        {/* Numero de gestas */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Número de gestas:</label>
                            <input
                                type="number"
                                name="numeroGestas"
                                value={datosPaciente.numeroGestas}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        {/* Fecha de ultima menstruacion */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Fecha de última menstruación:</label>
                            <input
                                type="date"
                                name="fum"
                                value={datosPaciente.fum}
                                onChange={manejarCambio}
                                max={today} // Limita la fecha al día de hoy o anteriores
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Metodo anticonceptivo */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Método anticonceptivo:</label>
                            <input
                                type="text"
                                name="metodoAnticonceptivo"
                                value={datosPaciente.metodoAnticonceptivo}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Trastornos hipertensivos del embarazo */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Trastornos hipertensivos del embarazo:</label>
                            <input
                                type="text"
                                name="trastornosHipertensivos"
                                value={datosPaciente.trastornosHipertensivos}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Diabetes gestacional */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Diabetes gestacional:</label>
                            <input
                                type="text"
                                name="diabetesGestacional"
                                value={datosPaciente.diabetesGestacional}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Síndrome de Ovario Poliquístico */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700">Síndrome de Ovario Poliquístico:</label>
                            <input
                                type="text"
                                name="sop"
                                value={datosPaciente.sop}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                )}
                {/* FIN DE CAMPOS CONDICIONALES */}


                {/* Edad */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Edad:</label>
                    <input
                        type="number"
                        name="edad"
                        value={datosPaciente.edad}
                        onChange={manejarCambio}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Hipertenso */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                        ¿Toma medicamentos para la hipertensión arterial?
                    </label>

                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setDatosPaciente({ ...datosPaciente, hipertenso: option });

                                    if (option === 'No') {
                                        setMedicamentosHipertensionSeleccionados([]);
                                        setOtroMedicamentoHipertension("");
                                    }
                                }}
                                className={`p-2 border rounded-md ${
                                    datosPaciente.hipertenso === option
                                        ? 'bg-green-500 text-white'
                                        : 'border-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {datosPaciente.hipertenso === 'Sí' && (
                        <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
                            <h4 className="text-md font-semibold text-gray-800">
                                Seleccione los medicamentos:
                            </h4>

                            <div className="max-h-60 overflow-y-auto pr-2">
                                {listaMedicamentosHipertension.map((medicamento, index) => (
                                    <div key={index} className="flex items-center my-1">
                                        <input
                                            type="checkbox"
                                            id={`med-ht-${index}`}
                                            value={medicamento}
                                            onChange={handleHipertensionMedChange}
                                            checked={medicamentosHipertensionSeleccionados.includes(medicamento)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`med-ht-${index}`} className="ml-3 text-sm text-gray-700">
                                            {medicamento}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* CAMPO PARA OTRO */}
                            {medicamentosHipertensionSeleccionados.includes("Otros") && (
                                <input
                                    type="text"
                                    placeholder="Especifique el medicamento"
                                    value={otroMedicamentoHipertension}
                                    onChange={(e) => setOtroMedicamentoHipertension(e.target.value)}
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Diabetes */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                        ¿Toma medicamentos para Diabetes?
                    </label>

                    <div className="flex space-x-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setDatosPaciente({ ...datosPaciente, diabetes: option });

                                    if (option === 'No') {
                                        setMedicamentosDiabetesSeleccionados([]);
                                        setOtroMedicamentoDiabetes("");
                                    }
                                }}
                                className={`p-2 border rounded-md ${
                                    datosPaciente.diabetes === option
                                        ? 'bg-green-500 text-white'
                                        : 'border-gray-300'
                                }`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>

                    {datosPaciente.diabetes === 'Sí' && (
                        <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
                            <h4 className="text-md font-semibold text-gray-800">
                                Seleccione los medicamentos:
                            </h4>

                            <div className="max-h-60 overflow-y-auto pr-2">
                                {listaMedicamentosDiabetes.map((medicamento, index) => (
                                    <div key={index} className="flex items-center my-1">
                                        <input
                                            type="checkbox"
                                            id={`med-db-${index}`}
                                            value={medicamento}
                                            onChange={handleDiabetesMedChange}
                                            checked={medicamentosDiabetesSeleccionados.includes(medicamento)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`med-db-${index}`} className="ml-3 text-sm text-gray-700">
                                            {medicamento}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* INPUT PARA OTRO */}
                            {medicamentosDiabetesSeleccionados.includes("Otra") && (
                                <input
                                    type="text"
                                    placeholder="Especifique el medicamento"
                                    value={otroMedicamentoDiabetes}
                                    onChange={(e) => setOtroMedicamentoDiabetes(e.target.value)}
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Medicación colesterol */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                        ¿Toma medicamentos para el colesterol?
                    </label>

                    <div className="flex space-x-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setDatosPaciente({ ...datosPaciente, medicolesterol: option });

                                    if (option === 'No') {
                                        setMedicamentosColesterolSeleccionados([]);
                                        setOtroMedicamentoColesterol("");
                                    }
                                }}
                                className={`p-2 border rounded-md ${
                                    datosPaciente.medicolesterol === option
                                        ? 'bg-green-500 text-white'
                                        : 'border-gray-300'
                                }`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>

                    {datosPaciente.medicolesterol === 'Sí' && (
                        <div className="p-4 mt-2 border-l-4 border-green-500 bg-green-50 space-y-2 rounded-r-lg">
                            <h4 className="text-md font-semibold text-gray-800">
                                Seleccione los medicamentos:
                            </h4>

                            <div className="max-h-60 overflow-y-auto pr-2">
                                {listaMedicamentosColesterol.map((medicamento, index) => (
                                    <div key={index} className="flex items-center my-1">
                                        <input
                                            type="checkbox"
                                            id={`med-col-${index}`}
                                            value={medicamento}
                                            onChange={handleColesterolMedChange}
                                            checked={medicamentosColesterolSeleccionados.includes(medicamento)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`med-col-${index}`} className="ml-3 text-sm text-gray-700">
                                            {medicamento}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* CAMPO PARA OTRO */}
                            {medicamentosColesterolSeleccionados.includes("Otro") && (
                                <input
                                    type="text"
                                    placeholder="Especifique el medicamento"
                                    value={otroMedicamentoColesterol}
                                    onChange={(e) => setOtroMedicamentoColesterol(e.target.value)}
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Aspirina ---------------*/}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Toma aspirina o anticuagulantes?</label>
                    <div className="flex space-x-2 mb-2">
                        {['sí', 'no'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, aspirina: option })}
                                className={`p-2 border rounded-md ${datosPaciente.aspirina === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fumador */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Es fumador?</label>
                    <div className="flex space-x-2 mb-2">
                        {['sí', 'no'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, fumador: option })}
                                className={`p-2 border rounded-md ${datosPaciente.fumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* exFumador */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Es exfumador?</label>
                    <div className="flex space-x-2 mb-2">
                        {['sí', 'no'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, exfumador: option })}
                                className={`p-2 border rounded-md ${datosPaciente.exfumador === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enfermedad cardiovascular */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Presenta enfermedad cardiovascular como infarto o acv?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, enfermedad: option })}
                                className={`p-2 border rounded-md ${datosPaciente.enfermedad === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Infarto */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Ha tenido un infarto?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, infarto: option })}
                                className={`p-2 border rounded-md ${datosPaciente.infarto === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ACV */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Ha tenido un ACV?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setDatosPaciente({ ...datosPaciente, acv: option })}
                                className={`p-2 border rounded-md ${datosPaciente.acv === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enfermedad Renal Cronica */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Renal Crónica?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, renal : option })}
                        className={`p-2 border rounded-md ${datosPaciente.renal === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Enfermedad Pulmonar */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Tiene enfermedad Pulmonar?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, pulmonar : option })}
                        className={`p-2 border rounded-md ${datosPaciente.pulmonar === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Alergias */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Alergias a medicamentos o antibióticos?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, alergias: option })}
                        className={`p-2 border rounded-md ${datosPaciente.alergias === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Tiroides */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Toma remedios para la tiroides?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, tiroides: option })}
                        className={`p-2 border rounded-md ${datosPaciente.tiroides === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
                </div>
                
                {/* Sedentarismo */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Realiza actividad física regularmente?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, sedentarismo: option })}
                        className={`p-2 border rounded-md ${datosPaciente.sedentarismo === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Sueño */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">¿Duerme entre 6 a 8 horas por día?</label>
                    <div className="flex space-x-2 mb-2">
                        {['Sí', 'No'].map(option => (
                        <button
                        key={option}
                        type="button"
                        onClick={() => setDatosPaciente({ ...datosPaciente, sueño: option })}
                        className={`p-2 border rounded-md ${datosPaciente.sueño === option ? 'bg-green-500 text-white' : 'border-gray-300'}`}
                        >
                        {option}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Presión Arterial */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">TA Máx.:</label>
                                <input
                                    type="number"
                                    name="presionArterial"
                                    value={datosPaciente.presionArterial}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    style={{ appearance: 'none' }}
                                />
                                <div className="mt-2 flex space-x-2">
                                    {[80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 200, 220, 240].map(valor => (
                                        <button
                                            key={valor}
                                            type="button"
                                            className={`p-2 border rounded ${datosPaciente.presionArterial === valor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                            onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, presionArterial: valor }))}
                                        >
                                            {valor}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tension Arterial Minima */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">TA Min.:</label>
                                <input
                                    type="number"
                                    name="taMin"
                                    value={datosPaciente.taMin}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    style={{ appearance: 'none' }}
                                />
                                <div className="mt-2 flex space-x-2">
                                    {[60, 70, 80, 90, 100, 110, 120, 130].map(valor => (
                                        <button
                                            key={valor}
                                            type="button"
                                            className={`p-2 border rounded ${datosPaciente.taMin === valor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                            onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, taMin: valor }))}
                                        >
                                            {valor}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className={`p-2 border rounded ${datosPaciente.taMin > 130 ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                        onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, taMin: 111 }))}
                                        >+130</button>
                                </div>
                            </div>

                            {/* Peso */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Peso (kg):</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={datosPaciente.peso}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Talla */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Talla (cm):</label>
                                <input
                                    type="number"
                                    name="talla"
                                    value={datosPaciente.talla}
                                    onChange={manejarCambio}
                                    className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Cintura */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Cintura (cm):</label>
                                <input
                                type="number"
                                name="cintura"
                                value={datosPaciente.cintura}
                                onChange={manejarCambio}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* SECCIÓN CLÍNICA */}
                            <div className="space-y-6">
                                {/* Síntomas de alarma */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-2">Síntomas de alarma</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {[
                                            "Dolor en el pecho o falta de aire al hacer esfuerzos",
                                            "Hinchazón de piernas, manos o cara por la tarde",
                                            "Micción frecuente nocturna",
                                            "Despertar por falta de aire o palpitaciones",
                                            "Mareos / desmayos / pérdidas de conocimiento",
                                            "Otro",
                                            "Ninguno"
                                        ].map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setSeleccionesClinicas(prev => {
                                                        const exists = prev.sintomaAlarma.includes(option);
                                                        const updated = exists
                                                            ? prev.sintomaAlarma.filter(v => v !== option)
                                                            : [...prev.sintomaAlarma, option];
                                                        return { ...prev, sintomaAlarma: updated };
                                                    });
                                                }}
                                                className={`p-2 text-sm border rounded-md transition-all ${
                                                    seleccionesClinicas.sintomaAlarma.includes(option)
                                                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    {seleccionesClinicas.sintomaAlarma.includes("Otro") && (
                                        <input
                                            type="text"
                                            placeholder="Especifique el síntoma"
                                            value={otrosClinicos.sintomaAlarmaOtro}
                                            onChange={(e) => setOtrosClinicos({...otrosClinicos, sintomaAlarmaOtro: e.target.value})}
                                            className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-red-500 outline-none"
                                        />
                                    )}
                                </div>

                                {/* Interconsulta */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-2">Interconsulta</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {["Clínica médica", "Endocrinología", "Ginecología", "Urología", "Psiquiatría", "Nutrición", "Neumonología", "Hematología", "Oftalmología", "Otro"].map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setSeleccionesClinicas(prev => {
                                                        const exists = prev.interconsulta.includes(option);
                                                        const updated = exists ? prev.interconsulta.filter(v => v !== option) : [...prev.interconsulta, option];
                                                        return { ...prev, interconsulta: updated };
                                                    });
                                                }}
                                                className={`p-2 text-sm border rounded-md transition-all ${
                                                    seleccionesClinicas.interconsulta.includes(option)
                                                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    {seleccionesClinicas.interconsulta.includes("Otro") && (
                                        <input
                                            type="text"
                                            placeholder="Especifique la especialidad"
                                            value={otrosClinicos.interconsultaOtro}
                                            onChange={(e) => setOtrosClinicos({...otrosClinicos, interconsultaOtro: e.target.value})}
                                            className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    )}
                                </div>

                                {/* Solicitar estudios */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-2">Solicitar estudios complementarios</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {["Ecocardiograma", "Ergometría", "Holter", "Mapeo", "Vasos de cuello", "Doppler MMII", "Ecografía abdominal", "Rayos X Tórax", "Otro"].map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setSeleccionesClinicas(prev => {
                                                        const exists = prev.solicitarEstudios.includes(option);
                                                        const updated = exists ? prev.solicitarEstudios.filter(v => v !== option) : [...prev.solicitarEstudios, option];
                                                        return { ...prev, solicitarEstudios: updated };
                                                    });
                                                }}
                                                className={`p-2 text-sm border rounded-md transition-all ${
                                                    seleccionesClinicas.solicitarEstudios.includes(option)
                                                        ? 'bg-purple-500 text-white border-purple-500 shadow-sm'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    {seleccionesClinicas.solicitarEstudios.includes("Otro") && (
                                        <input
                                            type="text"
                                            placeholder="Especifique el estudio"
                                            value={otrosClinicos.solicitarEstudiosOtro}
                                            onChange={(e) => setOtrosClinicos({...otrosClinicos, solicitarEstudiosOtro: e.target.value})}
                                            className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    )}
                                </div>

                                {/* Cambio de medicación */}
                                <div className="flex flex-col mt-4">
                                    <label className="text-sm font-medium text-gray-700 mb-2">Cambio de medicación</label>
                                    
                                    {/* Botones de selección múltiple */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {["Agrego", "Aumento", "Suspendo", "Reduzco", "Otro"].map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setSeleccionesClinicas(prev => {
                                                        const exists = prev.cambioMedicacion.includes(option);
                                                        const updated = exists 
                                                            ? prev.cambioMedicacion.filter(v => v !== option) 
                                                            : [...prev.cambioMedicacion, option];
                                                        return { ...prev, cambioMedicacion: updated };
                                                    });
                                                }}
                                                className={`p-2 text-sm border rounded-md transition-all ${
                                                    seleccionesClinicas.cambioMedicacion.includes(option)
                                                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Inputs condicionales que aparecen al marcar cada botón */}
                                    <div className="space-y-2 mt-2">
                                        {seleccionesClinicas.cambioMedicacion.includes("Agrego") && (
                                            <input
                                                type="text"
                                                placeholder="¿Qué medicamento agrega?"
                                                value={otrosClinicos.cambioAgrego}
                                                onChange={(e) => setOtrosClinicos({...otrosClinicos, cambioAgrego: e.target.value})}
                                                className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
                                            />
                                        )}

                                        {seleccionesClinicas.cambioMedicacion.includes("Aumento") && (
                                            <input
                                                type="text"
                                                placeholder="¿Qué aumentó y a cuánto? (ej: Enalapril 20mg)"
                                                value={otrosClinicos.cambioAumento}
                                                onChange={(e) => setOtrosClinicos({...otrosClinicos, cambioAumento: e.target.value})}
                                                className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
                                            />
                                        )}

                                        {seleccionesClinicas.cambioMedicacion.includes("Suspendo") && (
                                            <input
                                                type="text"
                                                placeholder="¿Qué medicamento suspendió?"
                                                value={otrosClinicos.cambioSuspendo}
                                                onChange={(e) => setOtrosClinicos({...otrosClinicos, cambioSuspendo: e.target.value})}
                                                className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
                                            />
                                        )}

                                        {seleccionesClinicas.cambioMedicacion.includes("Reduzco") && (
                                            <input
                                                type="text"
                                                placeholder="¿Qué redujo y a cuánto?"
                                                value={otrosClinicos.cambioReduzco}
                                                onChange={(e) => setOtrosClinicos({...otrosClinicos, cambioReduzco: e.target.value})}
                                                className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
                                            />
                                        )}

                                        {seleccionesClinicas.cambioMedicacion.includes("Otro") && (
                                            <input
                                                type="text"
                                                placeholder="Especifique otro cambio"
                                                value={otrosClinicos.cambioMedicacionOtro}
                                                onChange={(e) => setOtrosClinicos({...otrosClinicos, cambioMedicacionOtro: e.target.value})}
                                                className="p-2 border border-green-200 rounded-md text-sm w-full focus:ring-2 focus:ring-green-600 outline-none"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                {/* Doctor */}
                <div className="flex flex-col mt-4">
                    <div className="flex justify-end space-x-2">
                        {['Doctora Losada', 'Laboratorio', 'ElectroCardiograma'].map(doctor => (
                            <button
                                key={doctor}
                                type="button"
                                className={`p-2 border rounded ${datosPaciente.doctor === doctor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setDatosPaciente(prevDatos => ({ ...prevDatos, doctor }))}
                            >
                                {doctor.charAt(0).toUpperCase() + doctor.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={calcularRiesgo}
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                    Calcular Riesgo
                </button>
            </form>

            {/* Modal Resultados */}
            {mostrarModal && !modalAdvertencia && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <button onClick={guardarPaciente} className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
                                Guardar Paciente
                            </button>
                        </div>
                        {/* Función renal */}
                            <div className="mt-4 border-t pt-4">
                                {!mostrarRenal && (
                                    <button
                                        onClick={() => setMostrarRenal(true)}
                                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        ¿Desea calcular función renal?
                                    </button>
                                )}

                                {mostrarRenal && (
                                    <div className="mt-2">
                                        <label className="text-sm font-medium text-gray-700">Creatinina (mg/dl):</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={creatinina}
                                            onChange={(e) => setCreatinina(e.target.value)}
                                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {tfg && (
                                            <p className="mt-2 font-semibold text-gray-800">
                                                Filtrado glomerular: {tfg.toFixed(1)} ml/min/1,73 m²
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        <p><strong>DNI:</strong> {datosPaciente.cuil}</p>
                        <p><strong>Edad:</strong> {datosPaciente.edad}</p>
                        <p><strong>Género:</strong> {datosPaciente.genero}</p>

                        {/* Mostrar datos adicionales si es femenino */}
                        {datosPaciente.genero === 'femenino' && (
                            <div className="mt-2 pt-2 border-t">
                                <p><strong>Número de gestas:</strong> {datosPaciente.numeroGestas || 'No especificado'}</p>
                                <p><strong>Fecha de última menstruación:</strong> {datosPaciente.fum || 'No especificada'}</p>
                                <p><strong>Método anticonceptivo:</strong> {datosPaciente.metodoAnticonceptivo || 'No especificado'}</p>
                                <p><strong>Trastornos hipertensivos del embarazo:</strong> {datosPaciente.trastornosHipertensivos || 'No especificado'}</p>
                                <p><strong>Diabetes gestacional:</strong> {datosPaciente.diabetesGestacional || 'No especificado'}</p>
                                <p><strong>Síndrome de Ovario Poliquístico:</strong> {datosPaciente.sop || 'No especificado'}</p>
                            </div>
                        )}
                        
                        {/* Mostrar medicamentos para hipertensión si aplica */}
                        {datosPaciente.hipertenso === 'Sí' && datosPaciente.medicamentosHipertension && (
                             <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos para Hipertensión:</strong> {datosPaciente.medicamentosHipertension}</p>
                            </div>
                        )}
                        
                        {datosPaciente.diabetes === 'Sí' && datosPaciente.medicamentosDiabetes && (
                             <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos para Diabetes:</strong> {datosPaciente.medicamentosDiabetes}</p>
                            </div>
                        )}
                        
                        {datosPaciente.medicolesterol === 'Sí' && datosPaciente.medicamentosColesterol && (
                             <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos para Colesterol:</strong> {datosPaciente.medicamentosColesterol}</p>
                            </div>
                        )}

                        <p><strong>Diabetes:</strong> {datosPaciente.diabetes}</p>
                        <p><strong>Fumador:</strong> {datosPaciente.fumador}</p>
                        <p><strong>Ex-Fumador:</strong> {datosPaciente.exfumador}</p>
                        <p><strong>Tensión Arterial Máxima:</strong> {datosPaciente.presionArterial}</p>
                        <p><strong>Tensión Arterial Mínima:</strong> {datosPaciente.taMin}</p>
                        <p><strong>Colesterol:</strong> {datosPaciente.colesterol || 'No especificado'}</p>
                        <p><strong>Peso:</strong> {datosPaciente.peso || 'No especificado'} kg</p>
                        <p><strong>Talla:</strong> {datosPaciente.talla || 'No especificada'} cm</p>
                        <p><strong>Cintura:</strong> {datosPaciente.cintura || 'No especificada'} cm</p>
                        <p><strong>IMC:</strong> {datosPaciente.imc || 'No calculado'}</p>
                        <p><strong>Fecha de Registro:</strong> {datosPaciente.fechaRegistro}</p>
                        <p><strong>Nivel de Riesgo:</strong></p>
                        <div className="mb-4">
                            {renderRiesgoGrid(nivelRiesgo)}
                        </div>
                        <button onClick={cerrarModal} className="mt-4 w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Mensaje de éxito */}
            {mensajeExito && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-md">
                    {mensajeExito}
                </div>
            )}

            {/* Modal Advertencia */}
            {modalAdvertencia && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-11/12 max-w-lg">
                        <h2 className="text-lg font-semibold mb-4">Recomendaciones</h2>
                        <div className="overflow-y-auto max-h-80">
                            <pre className="whitespace-pre-wrap text-left">{modalAdvertencia}</pre>
                        </div>
                        <button onClick={cerrarModal} className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Formulario;