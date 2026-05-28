import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';

const FormularioEnfermera = () => {
    // ── Estado: carga ─────────────────────────────────────────────────────────
    const [carga, setCarga] = useState({
        dni: '',
        linkElectrocardiograma: '',
        linkEcocardiograma: '',
    });
    const [mensajeCarga, setMensajeCarga] = useState('');
    const [errorCarga, setErrorCarga] = useState('');
    const [guardando, setGuardando] = useState(false);

    // ── Estado: búsqueda ──────────────────────────────────────────────────────
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [estudio, setEstudio] = useState(null);
    const [errorBusqueda, setErrorBusqueda] = useState('');
    const [buscando, setBuscando] = useState(false);

    // ── Handlers: carga ───────────────────────────────────────────────────────
    const handleCargaChange = (e) => {
        const { name, value } = e.target;
        setCarga(prev => ({ ...prev, [name]: value }));
    };

    const validarCarga = () => {
        if (!carga.dni || carga.dni.length < 7) {
            setErrorCarga('El DNI debe tener al menos 7 dígitos.'); return false;
        }
        if (!carga.linkElectrocardiograma && !carga.linkEcocardiograma) {
            setErrorCarga('Ingresá al menos un link (electrocardiograma o ecocardiograma).'); return false;
        }
        return true;
    };

    const guardarEstudio = async () => {
        setErrorCarga('');
        setMensajeCarga('');
        if (!validarCarga()) return;

        setGuardando(true);
        try {
            await axiosInstance.post('/api/estudios', carga);
            setMensajeCarga('Estudio guardado con éxito.');
            setCarga({ dni: '', linkElectrocardiograma: '', linkEcocardiograma: '' });
        } catch (err) {
            console.error(err);
            setErrorCarga('Error al guardar. Verificá los datos e intentá de nuevo.');
        } finally {
            setGuardando(false);
        }
    };

    // ── Handlers: búsqueda ────────────────────────────────────────────────────
    const buscarEstudio = async () => {
        setErrorBusqueda('');
        setEstudio(null);
        if (!dniBusqueda || dniBusqueda.length < 7) {
            setErrorBusqueda('Ingresá un DNI válido para buscar.'); return;
        }
        setBuscando(true);
        try {
            const { data } = await axiosInstance.get(`/api/estudios/${dniBusqueda}`);
            setEstudio(data);
        } catch (err) {
            if (err.response?.status === 404) {
                setErrorBusqueda('No se encontraron estudios para ese DNI.');
            } else {
                setErrorBusqueda('Error al buscar. Intentá de nuevo.');
            }
        } finally {
            setBuscando(false);
        }
    };

    const abrirLink = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // ── JSX ───────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col items-center p-6 max-w-2xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-gray-800 w-full">Panel de Enfermería — Estudios</h1>

            {/* ── SECCIÓN CARGA ── */}
            <section className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Cargar nuevo estudio</h2>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">DNI del paciente</label>
                    <input
                        type="text"
                        name="dni"
                        value={carga.dni}
                        onChange={handleCargaChange}
                        placeholder="Ej: 30123456"
                        className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Guía ImgBB */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-bold text-yellow-800 text-base">📋 ¿Cómo subir la foto del estudio?</p>
                    <ol className="text-sm text-yellow-900 space-y-1 list-decimal list-inside">
                        <li>Hacé clic en el botón azul <strong>"Abrir ImgBB para subir foto"</strong></li>
                        <li>En la página que se abre, hacé clic en <strong>"Start uploading"</strong></li>
                        <li>Elegí la foto del estudio desde la computadora o el celular</li>
                        <li>Una vez subida, copiá el link que aparece abajo de la imagen</li>
                        <li>Volvé a esta página y pegá el link en el campo correspondiente</li>
                    </ol>
                    <button
                        type="button"
                        onClick={() => window.open('https://imgbb.com/upload', '_blank', 'noopener,noreferrer')}
                        className="mt-2 w-full py-3 bg-blue-600 text-white font-bold text-base rounded-lg hover:bg-blue-700 transition-colors shadow"
                    >
                        📤 Abrir ImgBB para subir foto
                    </button>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Link — Electrocardiograma <span className="text-gray-400">(pegá acá el link copiado de ImgBB)</span>
                    </label>
                    <input
                        type="url"
                        name="linkElectrocardiograma"
                        value={carga.linkElectrocardiograma}
                        onChange={handleCargaChange}
                        placeholder="https://ibb.co/..."
                        className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Link — Ecocardiograma <span className="text-gray-400">(pegá acá el link copiado de ImgBB)</span>
                    </label>
                    <input
                        type="url"
                        name="linkEcocardiograma"
                        value={carga.linkEcocardiograma}
                        onChange={handleCargaChange}
                        placeholder="https://ibb.co/..."
                        className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    />
                </div>

                {errorCarga && <p className="text-red-500 text-sm">{errorCarga}</p>}
                {mensajeCarga && <p className="text-green-600 text-sm font-medium">{mensajeCarga}</p>}

                <button
                    type="button"
                    onClick={guardarEstudio}
                    disabled={guardando}
                    className="w-full py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {guardando ? 'Guardando...' : 'Guardar estudio'}
                </button>
            </section>

            {/* ── SECCIÓN BÚSQUEDA ── */}
            <section className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Buscar estudios por DNI</h2>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={dniBusqueda}
                        onChange={(e) => setDniBusqueda(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && buscarEstudio()}
                        placeholder="Ingresá el DNI"
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        type="button"
                        onClick={buscarEstudio}
                        disabled={buscando}
                        className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {buscando ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>

                {errorBusqueda && <p className="text-red-500 text-sm">{errorBusqueda}</p>}

                {estudio && (
                    <div className="mt-4 space-y-4">
                        <p className="text-sm text-gray-500">
                            DNI: <span className="font-semibold text-gray-800">{estudio.dni}</span>
                            {estudio.fechaCarga && (
                                <span className="ml-3 text-gray-400">
                                    Cargado: {new Date(estudio.fechaCarga).toLocaleDateString('es-AR')}
                                </span>
                            )}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {estudio.linkElectrocardiograma ? (
                                <button
                                    type="button"
                                    onClick={() => abrirLink(estudio.linkElectrocardiograma)}
                                    className="flex items-center gap-2 px-5 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                                >
                                    ❤️ Electrocardiograma
                                </button>
                            ) : (
                                <span className="px-5 py-3 bg-gray-100 text-gray-400 rounded-lg text-sm">
                                    Sin electrocardiograma cargado
                                </span>
                            )}

                            {estudio.linkEcocardiograma ? (
                                <button
                                    type="button"
                                    onClick={() => abrirLink(estudio.linkEcocardiograma)}
                                    className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                                >
                                    🫀 Ecocardiograma
                                </button>
                            ) : (
                                <span className="px-5 py-3 bg-gray-100 text-gray-400 rounded-lg text-sm">
                                    Sin ecocardiograma cargado
                                </span>
                            )}
                        </div>

                        {/* Preview de imágenes si el link es de ImgBB u hosting de imagen directo */}
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            {estudio.linkElectrocardiograma && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Electrocardiograma</p>
                                    <img
                                        src={estudio.linkElectrocardiograma}
                                        alt="Electrocardiograma"
                                        className="w-full rounded-lg border border-gray-200 shadow-sm object-contain max-h-72"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                            )}
                            {estudio.linkEcocardiograma && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Ecocardiograma</p>
                                    <img
                                        src={estudio.linkEcocardiograma}
                                        alt="Ecocardiograma"
                                        className="w-full rounded-lg border border-gray-200 shadow-sm object-contain max-h-72"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default FormularioEnfermera;