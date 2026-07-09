package com.backend.rcv.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "estudios")
public class Estudio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Sección 1: Datos filiatorios ──────────────────────────────────────────
    @Column(length = 255)
    private String nombre;
    @Column(length = 255)
    private String apellido;
    @Column(nullable = false)
    private String dni;
    private String fechaNacimiento;
    private String edad;
    private String telefono;
    private String genero;

    // Ginecológico
    private String tuvoHijos;
    @Column(length = 500)
    private String complicacionesEmbarazo;

    // ── Sección 2: Eventos cardiovasculares ───────────────────────────────────
    @Column(length = 1000)
    private String eventosCv;

    // ── Sección 3: Factores de riesgo ─────────────────────────────────────────
    private String tomaMedicacion;
    private String hipertension;
    @Column(length = 1000)
    private String medsHipertension;
    private String otroMedHipertension;
    private String diabetes;
    @Column(length = 500)
    private String medsDiabetes;
    private String otroMedDiabetes;
    private String colesterol;
    @Column(length = 1000)
    private String medsColesterol;
    private String otroMedColesterol;
    private String estresAnsiedad;
    @Column(length = 500)
    private String estresDetalle;
    private String otrasPatologias;
    @Column(length = 500)
    private String otrasPatologiasDetalle;

    // ── Sección 4: Hábitos ────────────────────────────────────────────────────
    private String fuma;
    private String fumoPorMucho;
    private String tuvoCvAntes;
    private String enfermedadRenal;
    private String consumeAlcohol;
    private String duerme68;
    private String actividadFisica;

    // ── Sección 5: Síntomas ───────────────────────────────────────────────────
    @Column(length = 1000)
    private String sintomas;
    private String sintomaOtro;

    // ── Sección 6: Datos antropométricos ─────────────────────────────────────
    private String peso;
    private String talla;
    private String cintura;
    private String tensionSistolica;
    private String tensionDiastolica;
    private String imc;
    private String imcClasificacion;
    private String nivelRiesgo;

    // ── Sección 7: Estudios complementarios ──────────────────────────────────
    @Column(name = "link_electrocardiograma", length = 1000)
    private String linkElectrocardiograma;

    @Column(name = "link_ecocardiograma", length = 1000)
    private String linkEcocardiograma;

    @Column(name = "link_laboratorio", length = 1000)
    private String linkLaboratorio;

    private String tieneOtroEstudio;
    private String nombreOtroEstudio;

    @Column(name = "link_otro_estudio", length = 1000)
    private String linkOtroEstudio;

    // ── Auditoría ─────────────────────────────────────────────────────────────
    @Column(name = "fecha_carga")
    private LocalDateTime fechaCarga;

    @PrePersist
    public void prePersist() {
        this.fechaCarga = LocalDateTime.now();
    }

    // ── Getters y Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getEdad() { return edad; }
    public void setEdad(String edad) { this.edad = edad; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getTuvoHijos() { return tuvoHijos; }
    public void setTuvoHijos(String tuvoHijos) { this.tuvoHijos = tuvoHijos; }

    public String getComplicacionesEmbarazo() { return complicacionesEmbarazo; }
    public void setComplicacionesEmbarazo(String complicacionesEmbarazo) { this.complicacionesEmbarazo = complicacionesEmbarazo; }

    public String getEventosCv() { return eventosCv; }
    public void setEventosCv(String eventosCv) { this.eventosCv = eventosCv; }

    public String getTomaMedicacion() { return tomaMedicacion; }
    public void setTomaMedicacion(String tomaMedicacion) { this.tomaMedicacion = tomaMedicacion; }

    public String getHipertension() { return hipertension; }
    public void setHipertension(String hipertension) { this.hipertension = hipertension; }

    public String getMedsHipertension() { return medsHipertension; }
    public void setMedsHipertension(String medsHipertension) { this.medsHipertension = medsHipertension; }

    public String getOtroMedHipertension() { return otroMedHipertension; }
    public void setOtroMedHipertension(String otroMedHipertension) { this.otroMedHipertension = otroMedHipertension; }

    public String getDiabetes() { return diabetes; }
    public void setDiabetes(String diabetes) { this.diabetes = diabetes; }

    public String getMedsDiabetes() { return medsDiabetes; }
    public void setMedsDiabetes(String medsDiabetes) { this.medsDiabetes = medsDiabetes; }

    public String getOtroMedDiabetes() { return otroMedDiabetes; }
    public void setOtroMedDiabetes(String otroMedDiabetes) { this.otroMedDiabetes = otroMedDiabetes; }

    public String getColesterol() { return colesterol; }
    public void setColesterol(String colesterol) { this.colesterol = colesterol; }

    public String getMedsColesterol() { return medsColesterol; }
    public void setMedsColesterol(String medsColesterol) { this.medsColesterol = medsColesterol; }

    public String getOtroMedColesterol() { return otroMedColesterol; }
    public void setOtroMedColesterol(String otroMedColesterol) { this.otroMedColesterol = otroMedColesterol; }

    public String getEstresAnsiedad() { return estresAnsiedad; }
    public void setEstresAnsiedad(String estresAnsiedad) { this.estresAnsiedad = estresAnsiedad; }

    public String getEstresDetalle() { return estresDetalle; }
    public void setEstresDetalle(String estresDetalle) { this.estresDetalle = estresDetalle; }

    public String getOtrasPatologias() { return otrasPatologias; }
    public void setOtrasPatologias(String otrasPatologias) { this.otrasPatologias = otrasPatologias; }

    public String getOtrasPatologiasDetalle() { return otrasPatologiasDetalle; }
    public void setOtrasPatologiasDetalle(String otrasPatologiasDetalle) { this.otrasPatologiasDetalle = otrasPatologiasDetalle; }

    public String getFuma() { return fuma; }
    public void setFuma(String fuma) { this.fuma = fuma; }

    public String getFumoPorMucho() { return fumoPorMucho; }
    public void setFumoPorMucho(String fumoPorMucho) { this.fumoPorMucho = fumoPorMucho; }

    public String getTuvoCvAntes() { return tuvoCvAntes; }
    public void setTuvoCvAntes(String tuvoCvAntes) { this.tuvoCvAntes = tuvoCvAntes; }

    public String getEnfermedadRenal() { return enfermedadRenal; }
    public void setEnfermedadRenal(String enfermedadRenal) { this.enfermedadRenal = enfermedadRenal; }

    public String getConsumeAlcohol() { return consumeAlcohol; }
    public void setConsumeAlcohol(String consumeAlcohol) { this.consumeAlcohol = consumeAlcohol; }

    public String getDuerme68() { return duerme68; }
    public void setDuerme68(String duerme68) { this.duerme68 = duerme68; }

    public String getActividadFisica() { return actividadFisica; }
    public void setActividadFisica(String actividadFisica) { this.actividadFisica = actividadFisica; }

    public String getSintomas() { return sintomas; }
    public void setSintomas(String sintomas) { this.sintomas = sintomas; }

    public String getSintomaOtro() { return sintomaOtro; }
    public void setSintomaOtro(String sintomaOtro) { this.sintomaOtro = sintomaOtro; }

    public String getPeso() { return peso; }
    public void setPeso(String peso) { this.peso = peso; }

    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }

    public String getCintura() { return cintura; }
    public void setCintura(String cintura) { this.cintura = cintura; }

    public String getTensionSistolica() { return tensionSistolica; }
    public void setTensionSistolica(String tensionSistolica) { this.tensionSistolica = tensionSistolica; }

    public String getTensionDiastolica() { return tensionDiastolica; }
    public void setTensionDiastolica(String tensionDiastolica) { this.tensionDiastolica = tensionDiastolica; }

    public String getImc() { return imc; }
    public void setImc(String imc) { this.imc = imc; }

    public String getImcClasificacion() { return imcClasificacion; }
    public void setImcClasificacion(String imcClasificacion) { this.imcClasificacion = imcClasificacion; }

    public String getNivelRiesgo() { return nivelRiesgo; }
    public void setNivelRiesgo(String nivelRiesgo) { this.nivelRiesgo = nivelRiesgo; }

    public String getLinkElectrocardiograma() { return linkElectrocardiograma; }
    public void setLinkElectrocardiograma(String linkElectrocardiograma) { this.linkElectrocardiograma = linkElectrocardiograma; }

    public String getLinkEcocardiograma() { return linkEcocardiograma; }
    public void setLinkEcocardiograma(String linkEcocardiograma) { this.linkEcocardiograma = linkEcocardiograma; }

    public String getLinkLaboratorio() { return linkLaboratorio; }
    public void setLinkLaboratorio(String linkLaboratorio) { this.linkLaboratorio = linkLaboratorio; }

    public String getTieneOtroEstudio() { return tieneOtroEstudio; }
    public void setTieneOtroEstudio(String tieneOtroEstudio) { this.tieneOtroEstudio = tieneOtroEstudio; }

    public String getNombreOtroEstudio() { return nombreOtroEstudio; }
    public void setNombreOtroEstudio(String nombreOtroEstudio) { this.nombreOtroEstudio = nombreOtroEstudio; }

    public String getLinkOtroEstudio() { return linkOtroEstudio; }
    public void setLinkOtroEstudio(String linkOtroEstudio) { this.linkOtroEstudio = linkOtroEstudio; }

    public LocalDateTime getFechaCarga() { return fechaCarga; }
    public void setFechaCarga(LocalDateTime fechaCarga) { this.fechaCarga = fechaCarga; }
}