package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pacientes_circuito_completo")
public class PacienteCircuito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- DATOS DE GESTIÓN (ORIGEN, TURNO, ASISTENCIA) ---
    private String origenTurno;
    private Boolean asistio = false;
    private String fechaConsulta;
    private String ultimaConsulta;

    @Embedded
    private PatientInfo patientInfo;

    @Embedded
    private AntecedentesPersonales antecedentesPersonales;

    @Embedded
    private AntecedentesFamiliares antecedentesFamiliares;

    @Embedded
    private ExamenFisico examenFisico;

    @Embedded
    private LaboratorioDetallado laboratorio;

    @Embedded
    private ExamenOrina orina;

    @Embedded
    private EvaluacionClinica evaluacion;

    @ElementCollection
    private List<Medication> medicacionActual = new ArrayList<>();

    // =========================
    // 1. INFO PERSONAL (NOMBRE, DNI, TEL, SEXO)
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class PatientInfo {
        private String nombreApellido;
        private String fechaNacimiento;
        private String dni;
        private String telefono;
        private String sexo;
    }

    // =========================
    // 2. ANTECEDENTES PERSONALES (DIABETES, HTA, CANCER, etc.)
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class AntecedentesPersonales {
        private Boolean diabetes = false;
        private Boolean hipertension = false;
        private Boolean dislipidemia = false;
        private Boolean ecv = false; // Enfermedad Cardiovascular
        private Boolean epoc = false;
        private Boolean icc = false; // Insuficiencia Cardíaca
        private Boolean asma = false;
        private Boolean artritis = false;
        private Boolean enfermedadRenal = false;
        private Boolean ataqueCardiaco = false;
        private Boolean anginaPecho = false;
        private Boolean ictus = false;
        
        // CÁNCER Y PREVENCIÓN
        private Boolean cancer = false;
        private String cancerTipoAnio;
        private String mamografiaFecha;
        private String papSomfFecha; // PAP / SOMF (Sangre oculta en materia fecal)
        private String albuminuria;
    }

    // =========================
    // 3. ANTECEDENTES FAMILIARES (AF1... CDA... AL...)
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class AntecedentesFamiliares {
        private Boolean afDiabetes = false;
        private Boolean afHipertension = false;
        private Boolean afCardiopatia = false;
        private Boolean afAcv = false;
        private Boolean afCancer = false;
        private String afCancerTipoAnio;
        
        // Campos de codificación (AF1-4, CDT, CDA, AL, TA, FAT, RES, DEA, PDP)
        private String afCodigos; // Para agrupar AF1, AF2, AF3, AF4
        private String cdtCodigos; // CDT 1, 2, 3, 4
        private String cdaCodigos; // CDA 1, 2, 3
        private String alCodigos;  // AL 1, 2, 3 + Descripciones
        private String taCodigos;  // TA 1 al 10
        private String fatResDeaPdp; // FAT1, FAT2, RES1, RES2, DEA1, DEA2, PDP1
    }

    // =========================
    // 4. EXAMEN FÍSICO (PESO, TALLA, TA, FREC)
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class ExamenFisico {
        private Double peso;
        private Double talla;
        private Double contornoAbdominal;
        private Double imc;
        private String tensionArterial;
        private Integer frecuenciaCardiaca;
    }

    // =========================
    // 5. LABORATORIO (HEMOGRAMA Y QUÍMICA)
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class LaboratorioDetallado {
        // Hemograma
        private Double eritrocitos;
        private Double hemoglobina;
        private Double hematocrito;
        private Double vcm;
        private Double hcm;
        private Double chcm;
        private Double rdw;
        private Double leucocitos;
        private Double neutrofilosSegm;
        private Double eosinofilos;
        private Double basofilos;
        private Double linfocitos;
        private Double monocitos;
        private Double neutrofilosAbsoluto;
        private Double linfocitosAbsoluto;
        
        // Química
        private Double glucemia;
        private Double creatinina;
        private Double filtradoGlomerular;
        private Double sodio;
        private Double potasio;
        private Double cloro;
        private Double colesterolTotal;
        private Double hdl;
        private Double ldl;
        private Double trigliceridos;
    }

    // =========================
    // 6. ORINA COMPLETA
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class ExamenOrina {
        private Double proteinuria;
        private Double creatininuira;
        private Double relacionProteinaCreatinina;
        private String color;
        private String aspecto;
        private Double ph;
        private Double densidad;
        private String proteinas;
        private String glucosa;
        private String cetonas;
        private String bilirrubina;
        private String hemoglobina2; // Hemoglobina en orina
        private String urobilinogeno;
        private String nitritos;
        private String celulasEpitPlanas;
        private String leucocitosOrina;
        private String hematiesOrina;
    }

    // =========================
    // 7. ALERTAS Y RCV
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class EvaluacionClinica {
        private String rcvNivel; // Riesgo Cardiovascular
        private String alertasClinicas; // Texto largo para observaciones
    }

    // =========================
    // MEDICACIÓN (LISTA)
    // =========================
    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class Medication {
        private String descripcion;
        private String dosis;
        private String posologia;
    }
}