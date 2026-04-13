package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteCircuito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private PatientInfo patientInfo;

    @Embedded
    private ClinicalHistory clinicalHistory;

    @Embedded
    private VitalsAndLabs vitalsAndLabs;

    // 🔥 FIX IMPORTANTE
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "paciente_attachments",
            joinColumns = @JoinColumn(name = "paciente_id")
    )
    private List<Attachment> attachments = new ArrayList<>();

    // =========================
    // 📌 INFO PACIENTE
    // =========================
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientInfo {
        private String document;
        private String birthdate;
        private String gender;
        private String phone;
        private String name;
    }

    // =========================
    // 📌 HISTORIA CLINICA
    // =========================
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClinicalHistory {

        // 🔥 SIN "is"
        private boolean hypertensive;
        private boolean diabetic;
        private boolean hasDyslipidemia;
        private boolean smoker;
    }

    // =========================
    // 📌 SIGNOS Y LABS
    // =========================
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VitalsAndLabs {
        private String bloodPressure;
        private Integer totalCholesterol;
        private Double weightKg;
        private Integer heightCm;
        private Integer waistCircumferenceCm;
        private Integer estimatedGfr;
    }

    // =========================
    // 📌 ADJUNTOS
    // =========================
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Attachment {
        private String type;
        private String issueDate;
        private String fileUrl;
    }
}