package com.backend.rcv.model;

import lombok.Data;
import java.util.List;

@Data
public class PacienteCircuito {

    private PatientInfo patientInfo;
    private ClinicalHistory clinicalHistory;
    private VitalsAndLabs vitalsAndLabs;
    private List<Attachment> attachments;

    @Data
    public static class PatientInfo {
        private String document;
        private String birthdate;
        private String gender;
        private String phone;
        private String name;
    }

    @Data
    public static class ClinicalHistory {
        private boolean isHypertensive;
        private boolean isDiabetic;
        private boolean hasDyslipidemia;
        private boolean isSmoker;
    }

    @Data
    public static class VitalsAndLabs {
        private String bloodPressure;
        private Integer totalCholesterol;
        private Double weightKg;
        private Integer heightCm;
        private Integer waistCircumferenceCm;
        private Integer estimatedGfr;
    }

    @Data
    public static class Attachment {
        private String type;
        private String issueDate;
        private String fileUrl;
    }
}