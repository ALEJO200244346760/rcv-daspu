import React from 'react';
import { obtenerColorRiesgo } from './estadisticasUtils';

// ─────────────────────────────────────────────────────────────
// TARJETA DE PACIENTE EN ESTADÍSTICAS
// ─────────────────────────────────────────────────────────────

const CAMPOS_DETALLE = [
  { label: 'FUMA',                     key: 'fumador'                  },
  { label: 'EXFUMADOR',                key: 'exfumador'                },
  { label: 'COLESTEROL',               key: 'colesterol'               },
  { label: 'Medicamentos Colesterol',  key: 'medicamentosColesterol'   },
  { label: 'IMC',                      key: 'imc'                      },
  { label: 'Peso',                     key: 'peso'                     },
  { label: 'Talla',                    key: 'talla'                    },
  { label: 'Fecha de Registro',        key: 'fechaRegistro'            },
  { label: 'Hipertenso',               key: 'hipertenso'               },
  { label: 'Medicamentos Hipertensión',key: 'medicamentosHipertension' },
  { label: 'Diabetes',                 key: 'diabetes'                 },
  { label: 'Medicamentos Diabetes',    key: 'medicamentosDiabetes'     },
  { label: 'Aspirina',                 key: 'aspirina'                 },
  { label: 'TFG',                      key: 'tfg', unit: 'ml/min/1.73m²' },
  { label: 'Enfermedad',               key: 'enfermedad'               },
  { label: 'ACV',                      key: 'acv'                      },
  { label: 'Cintura',                  key: 'cintura'                  },
  { label: 'RENAL',                    key: 'renal'                    },
  { label: 'Infarto',                  key: 'infarto'                  },
  { label: 'Pulmonar',                 key: 'pulmonar'                 },
  { label: 'Alergias',                 key: 'alergias'                 },
  { label: 'Tiroides',                 key: 'tiroides'                 },
  { label: 'Sedentarismo',             key: 'sedentarismo'             },
  { label: 'Sueño',                    key: 'sueño'                    },
  { label: 'Número de Gestas',         key: 'numeroGestas'             },
  { label: 'FUM',                      key: 'fum'                      },
  { label: 'Método Anticonceptivo',    key: 'metodoAnticonceptivo'     },
  { label: 'Trastornos Hipertensivos', key: 'trastornosHipertensivos'  },
  { label: 'Diabetes Gestacional',     key: 'diabetesGestacional'      },
  { label: 'SOP',                      key: 'sop'                      },
  { label: 'Doctor',                   key: 'doctor'                   },
];

const TarjetaPaciente = ({ paciente, mostrarDetalle, onToggleDetalle, onEditar, onEliminar, onCopiar }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    {/* Datos siempre visibles */}
    {[
      { label: 'ID',       value: paciente.id             },
      { label: 'Edad',     value: paciente.edad           },
      { label: 'TELÉFONO', value: paciente.telefono       },
      { label: 'GÉNERO',   value: paciente.genero         },
      { label: 'DNI',      value: paciente.cuil           },
      { label: 'TA Máx.',  value: paciente.presionArterial},
      { label: 'TA Mín.',  value: paciente.taMin          },
      { label: 'Peso',     value: paciente.peso           },
      { label: 'Talla',    value: paciente.talla          },
    ].map(({ label, value }) => (
      <div key={label} className="flex justify-between items-start mb-2">
        <div className="text-sm font-medium text-gray-900">{label}:</div>
        <div className="text-sm text-gray-500">{value}</div>
      </div>
    ))}

    <div className="flex justify-between items-start mb-1">
      <div className="text-sm font-medium text-gray-900">Nivel de Riesgo:</div>
      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${obtenerColorRiesgo(paciente.nivelRiesgo)}`}>
        {paciente.nivelRiesgo}
      </span>
    </div>

    {/* Detalles expandibles */}
    {mostrarDetalle && (
      <div className="mt-2">
        {CAMPOS_DETALLE
          .filter(({ key }) => {
            const v = paciente[key];
            return v !== null && v !== undefined && v !== '' && v !== 'N/A';
          })
          .map(({ label, key, unit }) => (
            <div key={key} className="flex justify-between mb-2">
              <div className="w-2/5 text-sm font-medium text-gray-900">{label}:</div>
              <div className="w-2/5 text-sm text-gray-500 text-right">
                {unit ? `${paciente[key]} ${unit}` : paciente[key]}
              </div>
            </div>
          ))
        }
      </div>
    )}

    <button onClick={onToggleDetalle} className="text-indigo-600 hover:text-indigo-900 mt-2 text-sm">
      {mostrarDetalle ? 'Mostrar menos' : 'Mostrar más'}
    </button>

    <div className="flex justify-end mt-4 gap-4">
      <button onClick={onEditar}  className="text-indigo-600 hover:text-indigo-900 text-sm">Editar</button>
      <button onClick={onEliminar} className="text-red-600 hover:text-red-900 text-sm">Eliminar</button>
      <button onClick={onCopiar}  className="text-blue-600 hover:text-blue-900 text-sm">Copiar</button>
    </div>
  </div>
);

export default TarjetaPaciente;