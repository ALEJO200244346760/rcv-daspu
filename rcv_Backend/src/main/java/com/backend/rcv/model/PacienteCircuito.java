package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pacientes_circuito_completo")
public class PacienteCircuito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String origenTurno;

    private Boolean asistio = false;

    @Column(length = 50)
    private String fechaConsulta;

    @Column(length = 50)
    private String ultimaConsulta;

    @Embedded
    private PatientInfo patientInfo = new PatientInfo();

    @Embedded
    private AntecedentesPersonales antecedentesPersonales = new AntecedentesPersonales();

    @Embedded
    private AntecedentesFamiliares antecedentesFamiliares = new AntecedentesFamiliares();

    @Embedded
    private ExamenFisico examenFisico = new ExamenFisico();

    @Embedded
    private LaboratorioDetallado laboratorio = new LaboratorioDetallado();

    @Embedded
    private ExamenOrina orina = new ExamenOrina();

    @Embedded
    private EvaluacionClinica evaluacion = new EvaluacionClinica();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "paciente_medicaciones",
            joinColumns = @JoinColumn(name = "paciente_id")
    )
    private List<Medication> medicacionActual = new ArrayList<>();


    // =========================
    // PATIENT INFO
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientInfo {

        @Column(length = 255)
        private String nombreApellido;

        @Column(length = 50)
        private String fechaNacimiento;

        @Column(length = 50)
        private String dni;

        @Column(length = 50)
        private String telefono;

        @Column(length = 10)
        private String sexo;
    }


    // =========================
    // ANTECEDENTES PERSONALES
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AntecedentesPersonales {

        private Boolean diabetes = false;
        private Boolean hipertension = false;
        private Boolean dislipidemia = false;
        private Boolean ecv = false;
        private Boolean epoc = false;
        private Boolean icc = false;
        private Boolean asma = false;
        private Boolean artritis = false;
        private Boolean enfermedadRenal = false;
        private Boolean ataqueCardiaco = false;
        private Boolean anginaPecho = false;
        private Boolean ictus = false;
        private Boolean cancer = false;

        @Column(columnDefinition = "TEXT")
        private String cancerTipoAnio;

        @Column(columnDefinition = "TEXT")
        private String mamografiaFecha;

        @Column(columnDefinition = "TEXT")
        private String papSomfFecha;

        @Column(columnDefinition = "TEXT")
        private String albuminuria;
    }


    // =========================
    // ANTECEDENTES FAMILIARES
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AntecedentesFamiliares {

        private Boolean afDiabetes = false;
        private Boolean afHipertension = false;
        private Boolean afCardiopatia = false;
        private Boolean afAcv = false;
        private Boolean afCancer = false;

        @Column(columnDefinition = "TEXT")
        private String afCancerTipoAnio;

        @Column(columnDefinition = "TEXT")
        private String afCodigos;

        @Column(columnDefinition = "TEXT")
        private String cdtCodigos;

        @Column(columnDefinition = "TEXT")
        private String cdaCodigos;

        @Column(columnDefinition = "TEXT")
        private String alCodigos;

        @Column(columnDefinition = "TEXT")
        private String taCodigos;

        @Column(columnDefinition = "TEXT")
        private String fatResDeaPdp;
    }


    // =========================
    // EXAMEN FISICO
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamenFisico {

        private Double peso;
        private Double talla;
        private Double contornoAbdominal;
        private Double imc;

        @Column(length = 50)
        private String tensionArterial;

        private Double frecuenciaCardiaca;
    }


    // =========================
    // LABORATORIO
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LaboratorioDetallado {

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
        private Double eosinofilosAbsoluto;
        private Double basofilosAbsoluto;
        private Double linfocitosAbsoluto;
        private Double monocitosAbsoluto;

        private Double glucemia;
        private Double creatinina;

        @Column(length = 100)
        private String filtradoGlomerular;

        private Double sodio;
        private Double potasio;
        private Double cloro;
        private Double colesterolTotal;
        private Double hdl;
        private Double ldl;
        private Double trigliceridos;
    }


    // =========================
    // ORINA
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamenOrina {

        private Double proteinuria;
        private Double creatininuira;
        private Double relacionProteinaCreatinina;

        @Column(columnDefinition = "TEXT")
        private String color;

        @Column(columnDefinition = "TEXT")
        private String aspecto;

        private Double ph;
        private Double densidad;

        @Column(columnDefinition = "TEXT")
        private String proteinas;

        @Column(columnDefinition = "TEXT")
        private String glucosa;

        @Column(columnDefinition = "TEXT")
        private String cetonas;

        @Column(columnDefinition = "TEXT")
        private String bilirrubina;

        @Column(columnDefinition = "TEXT")
        private String hemoglobina2;

        @Column(columnDefinition = "TEXT")
        private String urobilinogeno;

        @Column(columnDefinition = "TEXT")
        private String nitritos;

        @Column(columnDefinition = "TEXT")
        private String celulasEpitPlanas;

        @Column(columnDefinition = "TEXT")
        private String leucocitosOrina;

        @Column(columnDefinition = "TEXT")
        private String hematiesOrina;
    }


    // =========================
    // EVALUACION
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluacionClinica {

        @Column(length = 100)
        private String rcvNivel;

        @Column(columnDefinition = "TEXT")
        private String alertasClinicas;
    }


    // =========================
    // MEDICACION
    // =========================

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Medication {

        @Column(columnDefinition = "TEXT")
        private String descripcion;

        @Column(length = 100)
        private String dosis;

        @Column(columnDefinition = "TEXT")
        private String posologia;
    }
}