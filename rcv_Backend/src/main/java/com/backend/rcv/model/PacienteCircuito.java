package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
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

    @ElementCollection
    private List<Attachment> attachments;

    @Embeddable
    @Data
    public static class PatientInfo {
        private String document;
        private String birthdate;
        private String gender;
        private String phone;
        private String name;
    }

    @Embeddable
    @Data
    public static class ClinicalHistory {
        private boolean isHypertensive;
        private boolean isDiabetic;
        private boolean hasDyslipidemia;
        private boolean isSmoker;
    }

    @Embeddable
    @Data
    public static class VitalsAndLabs {
        private String bloodPressure;
        private Integer totalCholesterol;
        private Double weightKg;
        private Integer heightCm;
        private Integer waistCircumferenceCm;
        private Integer estimatedGfr;
    }

    @Embeddable
    @Data
    public static class Attachment {
        private String type;
        private String issueDate;
        private String fileUrl;
    }
}