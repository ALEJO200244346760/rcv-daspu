package com.backend.rcv.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- DATOS GENERALES ---
    @Column
    private String fechaRegistro;

    @Column
    private String telefono;

    @Column
    private String doctor;

    @Column
    private String cuil;

    @Column
    private String edad;

    @Column
    private String genero;

    // --- ANTECEDENTES Y CONDICIONES ---
    @Column
    private String hipertenso;

    @Column(columnDefinition = "TEXT")
    private String medicamentosHipertension;

    @Column
    private String diabetes;

    @Column(columnDefinition = "TEXT")
    private String medicamentosDiabetes;

    @Column
    private String medicolesterol;

    @Column(columnDefinition = "TEXT")
    private String medicamentosColesterol;

    @Column
    private String fumador;

    @Column
    private String exfumador;

    @Column
    private String infarto;

    @Column
    private String acv;

    @Column
    private String renal;

    @Column
    private String pulmonar;

    @Column
    private String alergias;

    @Column
    private String tiroides;

    @Column
    private String sedentarismo;

    @Column
    private String sueño;

    @Column
    private String aspirina;

    @Column
    private String enfermedad;

    // --- MEDICIONES ---
    @Column
    private String presionArterial;

    @Column
    private String taMin;

    @Column
    private String colesterol;

    @Column
    private String peso;

    @Column
    private String talla;

    @Column
    private String imc;

    @Column
    private String cintura;

    @Column
    private String tfg;

    // --- RESULTADO ---
    @Column
    private String nivelRiesgo;

    // --- CAMPOS GÉNERO FEMENINO ---
    @Column
    private String numeroGestas;

    @Column
    private String fum;

    @Column
    private String metodoAnticonceptivo;

    @Column
    private String trastornosHipertensivos;

    @Column
    private String diabetesGestacional;

    @Column
    private String sop;

    @Column(columnDefinition = "TEXT")
    private String sintomaAlarma;

    @Column(columnDefinition = "TEXT")
    private String sintomaAlarmaOtro;

    @Column(columnDefinition = "TEXT")
    private String interconsulta;

    @Column(columnDefinition = "TEXT")
    private String interconsultaOtro;

    @Column(columnDefinition = "TEXT")
    private String solicitarEstudios;

    @Column(columnDefinition = "TEXT")
    private String solicitarEstudiosOtro;

    @Column(columnDefinition = "TEXT")
    private String cambioMedicacion;

    @Column(columnDefinition = "TEXT")
    private String cambioMedicacionOtro;
}