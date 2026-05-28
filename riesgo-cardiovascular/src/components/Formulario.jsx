import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { calcularRiesgoCardiovascular } from './Calculadora';
import { Advertencia, DatosPacienteInicial, obtenerColorRiesgo, obtenerTextoRiesgo } from './ConstFormulario';
import { getLocations } from '../services/userService';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import FormularioPaciente from './Formulario_Paciente';
import SeccionClinica from './SeccionClinica.jsx';

const Formulario = () => {
    const location = useLocation();
    const { user, roles } = useAuth();

    // ── Estado principal ──────────────────────────────────────────────────────
    const [datosPaciente, setDatosPaciente] = useState({
        ...DatosPacienteInicial,
        numeroGestas: '', fum: '', metodoAnticonceptivo: '',
        trastornosHipertensivos: '', diabetesGestacional: '', sop: '',
        medicamentosHipertension: '', medicamentosDiabetes: '', medicamentosColesterol: '',
    });

    const [nivelColesterolConocido, setNivelColesterolConocido] = useState(null);
    const [nivelRiesgo, setNivelRiesgo] = useState(null);
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalAdvertencia, setModalAdvertencia] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');
    const [ubicaciones, setUbicaciones] = useState([]);

    // ── Medicamentos ──────────────────────────────────────────────────────────
    const [otroMedicamentoHipertension, setOtroMedicamentoHipertension] = useState('');
    const [otroMedicamentoDiabetes, setOtroMedicamentoDiabetes] = useState('');
    const [otroMedicamentoColesterol, setOtroMedicamentoColesterol] = useState('');
    const [medicamentosHipertensionSeleccionados, setMedicamentosHipertensionSeleccionados] = useState([]);
    const [medicamentosDiabetesSeleccionados, setMedicamentosDiabetesSeleccionados] = useState([]);
    const [medicamentosColesterolSeleccionados, setMedicamentosColesterolSeleccionados] = useState([]);

    // ── Función renal ─────────────────────────────────────────────────────────
    const [mostrarRenal, setMostrarRenal] = useState(false);
    const [creatinina, setCreatinina] = useState('');
    const [tfg, setTfg] = useState(null);

    // ── Sección clínica ───────────────────────────────────────────────────────
    const [seleccionesClinicas, setSeleccionesClinicas] = useState({
        sintomaAlarma: [], interconsulta: [], solicitarEstudios: [], cambioMedicacion: []
    });
    const [otrosClinicos, setOtrosClinicos] = useState({
        sintomaAlarmaOtro: '', interconsultaOtro: '', solicitarEstudiosOtro: '',
        cambioMedicacionOtro: '', cambioAgrego: '', cambioAumento: '',
        cambioSuspendo: '', cambioReduzco: ''
    });

    // ── Carga de paciente desde navegación ───────────────────────────────────
    useEffect(() => {
        if (!location.state?.pacienteSeleccionado) return;

        const p = location.state.pacienteSeleccionado;
        const info = p.patientInfo || {};
        const fisico = p.examenFisico || {};
        const lab = p.laboratorio || {};
        const ant = p.antecedentesPersonales || {};
        const medLista = p.medicacionActual || [];

        let edadCalculada = '';
        if (info.fechaNacimiento) {
            const birth = new Date(info.fechaNacimiento);
            const hoy = new Date();
            edadCalculada = hoy.getFullYear() - birth.getFullYear();
            if (hoy.getMonth() < birth.getMonth() || (hoy.getMonth() === birth.getMonth() && hoy.getDate() < birth.getDate()))
                edadCalculada--;
        }

        let sistolica = '', diastolica = '';
        if (fisico.tensionArterial?.includes('/')) {
            [sistolica, diastolica] = fisico.tensionArterial.split('/').map(s => s.trim());
        }

        const nombresMeds = medLista.map(m => `${m.descripcion} ${m.dosis}`);
        if (ant.hipertension) setMedicamentosHipertensionSeleccionados(nombresMeds);
        if (ant.diabetes) setMedicamentosDiabetesSeleccionados(nombresMeds);
        if (ant.dislipidemia) setMedicamentosColesterolSeleccionados(nombresMeds);

        setDatosPaciente(prev => ({
            ...prev,
            cuil: info.dni || '',
            telefono: info.telefono || '',
            genero: info.sexo === 'M' ? 'masculino' : info.sexo === 'F' ? 'femenino' : '',
            edad: edadCalculada.toString(),
            peso: fisico.peso?.toString() || '',
            talla: fisico.talla ? (fisico.talla * 100).toString() : '',
            cintura: fisico.contornoAbdominal?.toString() || '',
            imc: fisico.imc?.toString() || '',
            presionArterial: sistolica,
            taMin: diastolica,
            hipertenso: ant.hipertension ? 'Sí' : 'No',
            diabetes: ant.diabetes ? 'Sí' : 'No',
            medicolesterol: (ant.dislipidemia || lab.colesterolTotal > 0) ? 'Sí' : 'No',
            colesterol: lab.colesterolTotal?.toString() || '',
            infarto: ant.ataqueCardiaco ? 'Sí' : 'No',
            acv: ant.ictus ? 'Sí' : 'No',
            renal: ant.enfermedadRenal ? 'Sí' : 'No',
            enfermedad: ant.ecv ? 'Sí' : 'No',
            tfg: lab.filtradoGlomerular?.toString() || '',
        }));

        if (lab.colesterolTotal > 0) setNivelColesterolConocido(true);
    }, [location.state]);

    // ── Cálculo de TFG ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!creatinina || isNaN(creatinina) || !datosPaciente.edad || !datosPaciente.genero) {
            setTfg(null); return;
        }
        const edad = Number(datosPaciente.edad);
        const cr = parseFloat(creatinina);
        let resultado;
        if (datosPaciente.genero === 'femenino') {
            resultado = cr <= 0.7
                ? 144 * Math.pow(cr / 0.7, -0.329) * Math.pow(0.993, edad)
                : 144 * Math.pow(cr / 0.7, -1.209) * Math.pow(0.993, edad);
        } else {
            resultado = cr <= 0.9
                ? 141 * Math.pow(cr / 0.9, -0.411) * Math.pow(0.993, edad)
                : 141 * Math.pow(cr / 0.9, -1.209) * Math.pow(0.993, edad);
        }
        setTfg(resultado);
    }, [creatinina, datosPaciente.edad, datosPaciente.genero]);

    // ── Sincronizar medicamentos seleccionados al campo de texto ─────────────
    useEffect(() => {
        setDatosPaciente(prev => ({ ...prev, medicamentosHipertension: medicamentosHipertensionSeleccionados.join('; ') }));
    }, [medicamentosHipertensionSeleccionados]);

    useEffect(() => {
        setDatosPaciente(prev => ({ ...prev, medicamentosDiabetes: medicamentosDiabetesSeleccionados.join('; ') }));
    }, [medicamentosDiabetesSeleccionados]);

    useEffect(() => {
        setDatosPaciente(prev => ({ ...prev, medicamentosColesterol: medicamentosColesterolSeleccionados.join('; ') }));
    }, [medicamentosColesterolSeleccionados]);

    // ── Ubicación del usuario ─────────────────────────────────────────────────
    useEffect(() => {
        if (user?.ubicacion) {
            setDatosPaciente(prev => ({ ...prev, ubicacion: user.ubicacion.nombre }));
        }
    }, [user]);

    useEffect(() => {
        getLocations().then(setUbicaciones);
    }, []);

    // ── Handlers de medicamentos ──────────────────────────────────────────────
    const makeCheckboxHandler = (setter) => (e) => {
        const { value, checked } = e.target;
        setter(prev => checked ? [...prev, value] : prev.filter(m => m !== value));
    };

    const handleHipertensionMedChange = makeCheckboxHandler(setMedicamentosHipertensionSeleccionados);
    const handleDiabetesMedChange = makeCheckboxHandler(setMedicamentosDiabetesSeleccionados);
    const handleColesterolMedChange = makeCheckboxHandler(setMedicamentosColesterolSeleccionados);

    // ── Cambio de campo genérico ──────────────────────────────────────────────
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosPaciente(prev => ({ ...prev, [name]: value }));
        if (name === 'cuil') {
            const soloNumeros = /^\d+$/;
            if (value.length > 0 && value.length < 7) setError('El CUIL o DNI debe tener al menos 7 dígitos.');
            else if (value.length >= 7 && !soloNumeros.test(value)) setError('El CUIL o DNI debe contener solo números.');
            else setError('');
        }
    };

    const manejarSeleccionColesterol = (value) => {
        setNivelColesterolConocido(value === 'si');
        setDatosPaciente(prev => ({
            ...prev,
            colesterol: value === 'no' ? 'No' : prev.colesterol
        }));
    };

    // ── Cálculo de IMC y riesgo ───────────────────────────────────────────────
    const calcularIMC = () => {
        const peso = parseFloat(datosPaciente.peso);
        const tallaCm = parseFloat(datosPaciente.talla);
        if (peso && tallaCm) return (peso / Math.pow(tallaCm / 100, 2)).toFixed(2);
        return '';
    };

    const ajustarEdad = (e) => e < 50 ? 40 : e <= 59 ? 50 : e <= 69 ? 60 : 70;
    const ajustarPresion = (p) => p < 140 ? 120 : p <= 159 ? 140 : p <= 179 ? 160 : 180;

    const validarCampos = () => {
        const { edad, genero, cuil, diabetes, fumador, exfumador, presionArterial, infarto, acv, renal } = datosPaciente;
        if (!edad || !genero || !cuil || !diabetes || !fumador || !exfumador || !presionArterial || !infarto || !acv || !renal) {
            setError('Por favor, complete todos los campos obligatorios.'); return false;
        }
        if (cuil.length < 7) { setError('El CUIL debe tener al menos 7 dígitos.'); return false; }
        if (edad < 1 || edad > 120) { setError('La edad debe estar entre 1 y 120 años.'); return false; }
        if (presionArterial < 50 || presionArterial > 250) { setError('La tensión arterial debe estar entre 60 y 250.'); return false; }
        setError(''); return true;
    };

    const calcularRiesgo = () => {
        if (!validarCampos()) { setModalAdvertencia('Todos los campos deben estar completos.'); setMostrarModal(true); return; }
        if (nivelColesterolConocido && !datosPaciente.colesterol) { setModalAdvertencia('Debe ingresar el nivel de colesterol.'); setMostrarModal(true); return; }

        const { edad, genero, diabetes, fumador, exfumador, presionArterial, colesterol, enfermedad, infarto, acv, renal } = datosPaciente;

        if (enfermedad === 'Sí' || infarto === 'Sí' || acv === 'Sí' || renal === 'Sí' || diabetes === 'Sí') {
            setNivelRiesgo('>20% <30% Alto'); setMostrarModal(true); return;
        }

        const imc = calcularIMC();
        setDatosPaciente(prev => ({ ...prev, imc }));
        const riesgo = calcularRiesgoCardiovascular(ajustarEdad(parseInt(edad)), genero, diabetes, fumador, ajustarPresion(parseInt(presionArterial)), colesterol);
        setNivelRiesgo(riesgo);
        setMostrarModal(true);
    };

    // ── Guardar ───────────────────────────────────────────────────────────────
    const formatearDataClinica = (lista, textoManual) => {
        const filtrados = lista.filter(v => v !== 'Otro' && v !== 'Ninguno');
        if (textoManual?.trim()) filtrados.push(textoManual.trim());
        return filtrados.join('; ');
    };

    const guardarPaciente = async () => {
        try {
            const listaCambios = [];
            if (seleccionesClinicas.cambioMedicacion.includes('Agrego')) listaCambios.push(`Agregó: ${otrosClinicos.cambioAgrego || '(sin especificar)'}`);
            if (seleccionesClinicas.cambioMedicacion.includes('Aumento')) listaCambios.push(`Aumentó: ${otrosClinicos.cambioAumento || '(sin especificar)'}`);
            if (seleccionesClinicas.cambioMedicacion.includes('Suspendo')) listaCambios.push(`Suspendió: ${otrosClinicos.cambioSuspendo || '(sin especificar)'}`);
            if (seleccionesClinicas.cambioMedicacion.includes('Reduzco')) listaCambios.push(`Redujo: ${otrosClinicos.cambioReduzco || '(sin especificar)'}`);
            if (seleccionesClinicas.cambioMedicacion.includes('Otro')) listaCambios.push(`Otro cambio: ${otrosClinicos.cambioMedicacionOtro || '(sin especificar)'}`);

            const payload = {
                ...datosPaciente, nivelRiesgo, tfg,
                sintomaAlarma: formatearDataClinica(seleccionesClinicas.sintomaAlarma, otrosClinicos.sintomaAlarmaOtro),
                interconsulta: formatearDataClinica(seleccionesClinicas.interconsulta, otrosClinicos.interconsultaOtro),
                solicitarEstudios: formatearDataClinica(seleccionesClinicas.solicitarEstudios, otrosClinicos.solicitarEstudiosOtro),
                cambioMedicacion: listaCambios.join('; '),
            };

            await axiosInstance.post('/api/pacientes', payload);
            setMensajeExito('Paciente guardado con éxito');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            console.error('Error al guardar:', err);
            setModalAdvertencia('Error al guardar los datos.');
            setMostrarModal(true);
        }
    };

    const cerrarModal = () => { setMostrarModal(false); setModalAdvertencia(null); };
    const abrirModalAdvertencia = (nivel) => setModalAdvertencia(Advertencia[nivel]);

    // ── Render del grid de riesgo ─────────────────────────────────────────────
    const renderRiesgoGrid = (riesgo) => {
        const niveles = ['<10% Bajo', '>10% <20% Moderado', '>20% <30% Alto', '>30% <40% Muy Alto', '>40% Crítico'];
        return (
            <div className="grid grid-cols-12 gap-2">
                {niveles.map(nivel => (
                    <React.Fragment key={nivel}>
                        <div className={`col-span-4 ${obtenerColorRiesgo(nivel)}`} />
                        <div
                            className={`col-span-8 ${riesgo === nivel ? obtenerColorRiesgo(nivel) : 'bg-gray-300'} p-2 cursor-pointer`}
                            onClick={() => abrirModalAdvertencia(nivel)}
                        >
                            <span className={riesgo === nivel ? 'text-white' : 'text-gray-600'}>
                                {obtenerTextoRiesgo(nivel)}
                            </span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    // ── JSX ───────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto">
            <form className="w-full space-y-6">
                <h1 className="text-3xl font-bold mb-6">Formulario de Evaluación de Riesgo Cardiovascular</h1>

                {/* Datos del paciente y medicamentos */}
                <FormularioPaciente
                    datosPaciente={datosPaciente}
                    manejarCambio={manejarCambio}
                    setDatosPaciente={setDatosPaciente}
                    nivelColesterolConocido={nivelColesterolConocido}
                    manejarSeleccionColesterol={manejarSeleccionColesterol}
                    medicamentosHipertensionSeleccionados={medicamentosHipertensionSeleccionados}
                    handleHipertensionMedChange={handleHipertensionMedChange}
                    otroMedicamentoHipertension={otroMedicamentoHipertension}
                    setOtroMedicamentoHipertension={setOtroMedicamentoHipertension}
                    medicamentosDiabetesSeleccionados={medicamentosDiabetesSeleccionados}
                    handleDiabetesMedChange={handleDiabetesMedChange}
                    otroMedicamentoDiabetes={otroMedicamentoDiabetes}
                    setOtroMedicamentoDiabetes={setOtroMedicamentoDiabetes}
                    medicamentosColesterolSeleccionados={medicamentosColesterolSeleccionados}
                    handleColesterolMedChange={handleColesterolMedChange}
                    otroMedicamentoColesterol={otroMedicamentoColesterol}
                    setOtroMedicamentoColesterol={setOtroMedicamentoColesterol}
                    setMedicamentosHipertensionSeleccionados={setMedicamentosHipertensionSeleccionados}
                    setMedicamentosDiabetesSeleccionados={setMedicamentosDiabetesSeleccionados}
                    setMedicamentosColesterolSeleccionados={setMedicamentosColesterolSeleccionados}
                />

                {/* Sección clínica */}
                <SeccionClinica
                    seleccionesClinicas={seleccionesClinicas}
                    setSeleccionesClinicas={setSeleccionesClinicas}
                    otrosClinicos={otrosClinicos}
                    setOtrosClinicos={setOtrosClinicos}
                />

                {/* Doctor */}
                <div className="flex flex-col mt-4">
                    <div className="flex justify-end space-x-2">
                        {['Doctora Losada', 'Laboratorio', 'ElectroCardiograma'].map(doctor => (
                            <button key={doctor} type="button"
                                className={`p-2 border rounded ${datosPaciente.doctor === doctor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setDatosPaciente(prev => ({ ...prev, doctor }))}
                            >
                                {doctor}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="button" onClick={calcularRiesgo}
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                    Calcular Riesgo
                </button>
            </form>

            {/* Modal de resultados */}
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
                            {!mostrarRenal ? (
                                <button onClick={() => setMostrarRenal(true)} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                    ¿Desea calcular función renal?
                                </button>
                            ) : (
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-gray-700">Creatinina (mg/dl):</label>
                                    <input type="number" step="0.01" value={creatinina}
                                        onChange={(e) => setCreatinina(e.target.value)}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    {tfg && <p className="mt-2 font-semibold text-gray-800">Filtrado glomerular: {tfg.toFixed(1)} ml/min/1,73 m²</p>}
                                </div>
                            )}
                        </div>

                        {/* Resumen de datos */}
                        <p><strong>DNI:</strong> {datosPaciente.cuil}</p>
                        <p><strong>Edad:</strong> {datosPaciente.edad}</p>
                        <p><strong>Género:</strong> {datosPaciente.genero}</p>

                        {datosPaciente.genero === 'femenino' && (
                            <div className="mt-2 pt-2 border-t">
                                <p><strong>Gestas:</strong> {datosPaciente.numeroGestas || 'No especificado'}</p>
                                <p><strong>FUM:</strong> {datosPaciente.fum || 'No especificada'}</p>
                                <p><strong>Anticonceptivo:</strong> {datosPaciente.metodoAnticonceptivo || 'No especificado'}</p>
                                <p><strong>Trastornos hipertensivos:</strong> {datosPaciente.trastornosHipertensivos || 'No especificado'}</p>
                                <p><strong>Diabetes gestacional:</strong> {datosPaciente.diabetesGestacional || 'No especificado'}</p>
                                <p><strong>SOP:</strong> {datosPaciente.sop || 'No especificado'}</p>
                            </div>
                        )}

                        {datosPaciente.hipertenso === 'Sí' && datosPaciente.medicamentosHipertension && (
                            <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos Hipertensión:</strong> {datosPaciente.medicamentosHipertension}</p>
                            </div>
                        )}
                        {datosPaciente.diabetes === 'Sí' && datosPaciente.medicamentosDiabetes && (
                            <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos Diabetes:</strong> {datosPaciente.medicamentosDiabetes}</p>
                            </div>
                        )}
                        {datosPaciente.medicolesterol === 'Sí' && datosPaciente.medicamentosColesterol && (
                            <div className="mt-2 pt-2 border-t">
                                <p><strong>Medicamentos Colesterol:</strong> {datosPaciente.medicamentosColesterol}</p>
                            </div>
                        )}

                        <p><strong>Diabetes:</strong> {datosPaciente.diabetes}</p>
                        <p><strong>Fumador:</strong> {datosPaciente.fumador}</p>
                        <p><strong>Ex-Fumador:</strong> {datosPaciente.exfumador}</p>
                        <p><strong>TA Máx:</strong> {datosPaciente.presionArterial}</p>
                        <p><strong>TA Mín:</strong> {datosPaciente.taMin}</p>
                        <p><strong>Colesterol:</strong> {datosPaciente.colesterol || 'No especificado'}</p>
                        <p><strong>Peso:</strong> {datosPaciente.peso || 'No especificado'} kg</p>
                        <p><strong>Talla:</strong> {datosPaciente.talla || 'No especificada'} cm</p>
                        <p><strong>Cintura:</strong> {datosPaciente.cintura || 'No especificada'} cm</p>
                        <p><strong>IMC:</strong> {datosPaciente.imc || 'No calculado'}</p>
                        <p><strong>Fecha de Registro:</strong> {datosPaciente.fechaRegistro}</p>
                        <p><strong>Nivel de Riesgo:</strong></p>
                        <div className="mb-4">{renderRiesgoGrid(nivelRiesgo)}</div>

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

            {/* Modal advertencia */}
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