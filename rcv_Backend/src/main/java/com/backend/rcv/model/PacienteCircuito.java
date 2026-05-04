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

    private String origenTurno;
    private Boolean asistio = false;
    private String fechaConsulta;
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

    @ElementCollection
    private List<Medication> medicacionActual = new ArrayList<>();

    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class PatientInfo {
        private String nombreApellido;
        private String fechaNacimiento;
        private String dni;
        private String telefono;
        private String sexo;
    }

    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
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
        private String cancerTipoAnio;
        private String mamografiaFecha;
        private String papSomfFecha;
        private String albuminuria;
    }

    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class AntecedentesFamiliares {
        private Boolean afDiabetes = false;
        private Boolean afHipertension = false;
        private Boolean afCardiopatia = false;
        private Boolean afAcv = false;
        private Boolean afCancer = false;
        private String afCancerTipoAnio;
        private String afCodigos;
        private String cdtCodigos;
        private String cdaCodigos;
        private String alCodigos;
        private String taCodigos;
        private String fatResDeaPdp;
    }

    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class ExamenFisico {
        private Double peso;
        private Double talla;
        private Double contornoAbdominal;
        private Double imc;
        private String tensionArterial;
        private Integer frecuenciaCardiaca;
    }

    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
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
        private Double linfocitosAbsoluto;
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
        private String hemoglobina2;
        private String urobilinogeno;
        private String nitritos;
        private String celulasEpitPlanas;
        private String leucocitosOrina;
        private String hematiesOrina;
    }

    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class EvaluacionClinica {
        private String rcvNivel;
        private String alertasClinicas;
    }

    @Embeddable @Data @NoArgsConstructor @AllArgsConstructor
    public static class Medication {
        private String descripcion;
        private String dosis;
        private String posologia;
    }
}