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

    // ✅ IMPORTANTE: versión SIMPLE (la que funcionaba)
    @ElementCollection
    private List<Attachment> attachments = new ArrayList<>();

    // =========================
    // PATIENT INFO
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
    // CLINICAL HISTORY
    // =========================
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClinicalHistory {
        private Boolean hypertensive = false;
        private Boolean diabetic = false;
        private Boolean hasDyslipidemia = false;
        private Boolean smoker = false;
    }

    // =========================
    // VITALS
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
    // ATTACHMENTS (ECG / ECO / PDF)
    // =========================
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Attachment {
        private String type;       // Electrocardiogram / Echocardiogram
        private String issueDate;
        private String fileUrl;
    }
}