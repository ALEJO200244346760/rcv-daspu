package com.backend.rcv.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "estudios")
public class Estudio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Datos filiatorios ──────────────────────────────────────
    private String nombreApellido;          // NUEVO
    private String dni;
    private String fechaNacimiento;
    private String edad;
    private String telefono;
    private String genero;

    // Ginecológico
    private String tuvoHijos;
    @Column(columnDefinition = "TEXT")
    private String complicacionesEmbarazo;

    // ── Sección 2: Eventos CV ─────────────────────────────────
    @Column(columnDefinition = "TEXT")
    private String eventosCv;

    // ── Sección 3: Factores de riesgo ────────────────────────
    private String tomaMedicacion;
    private String hipertension;
    @Column(columnDefinition = "TEXT")
    private String medsHipertension;
    private String otroMedHipertension;

    private String diabetes;
    @Column(columnDefinition = "TEXT")
    private String medsDiabetes;
    private String otroMedDiabetes;

    private String colesterol;
    @Column(columnDefinition = "TEXT")
    private String medsColesterol;
    private String otroMedColesterol;

    private String estresAnsiedad;
    @Column(columnDefinition = "TEXT")
    private String estresDetalle;

    private String otrasPatologias;
    @Column(columnDefinition = "TEXT")
    private String otrasPatologiasDetalle;

    private String antecedentesFamiliaresCardiopatia;  // NUEVO

    // ── Sección 4: Hábitos ───────────────────────────────────
    private String fuma;
    private String fumoPorMucho;
    private String consumeAlcohol;
    private String duerme68;
    private String actividadFisica;

    // ── Sección 5: Síntomas ──────────────────────────────────
    @Column(columnDefinition = "TEXT")
    private String sintomas;
    private String sintomaOtro;

    // ── Sección 6: Antropométricos ───────────────────────────
    private String peso;
    private String talla;
    private String cintura;
    private String tensionSistolica;
    private String tensionDiastolica;

    // Índices calculados
    private String imc;
    private String imcClasificacion;
    private String ict;                   // NUEVO
    private String ictCategoria;          // NUEVO

    // ── Sección 7: Estudios ──────────────────────────────────
    private String linkElectrocardiograma;
    private String linkEcocardiograma;
    private String linkLaboratorio;
    private String tieneOtroEstudio;
    private String linkOtroEstudio;
    private String nombreOtroEstudio;

    // ── Resultado ────────────────────────────────────────────
    private String nivelRiesgo;

    // ── Auditoría ────────────────────────────────────────────
    private LocalDate fechaCarga;

    @PrePersist
    protected void prePersist() {
        if (this.fechaCarga == null) {
            this.fechaCarga = LocalDate.now();
        }
    }

    // ── Getters y Setters ────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreApellido() { return nombreApellido; }
    public void setNombreApellido(String nombreApellido) { this.nombreApellido = nombreApellido; }

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

    public String getAntecedentesFamiliaresCardiopatia() { return antecedentesFamiliaresCardiopatia; }
    public void setAntecedentesFamiliaresCardiopatia(String antecedentesFamiliaresCardiopatia) { this.antecedentesFamiliaresCardiopatia = antecedentesFamiliaresCardiopatia; }

    public String getFuma() { return fuma; }
    public void setFuma(String fuma) { this.fuma = fuma; }

    public String getFumoPorMucho() { return fumoPorMucho; }
    public void setFumoPorMucho(String fumoPorMucho) { this.fumoPorMucho = fumoPorMucho; }

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

    public String getIct() { return ict; }
    public void setIct(String ict) { this.ict = ict; }

    public String getIctCategoria() { return ictCategoria; }
    public void setIctCategoria(String ictCategoria) { this.ictCategoria = ictCategoria; }

    public String getLinkElectrocardiograma() { return linkElectrocardiograma; }
    public void setLinkElectrocardiograma(String linkElectrocardiograma) { this.linkElectrocardiograma = linkElectrocardiograma; }

    public String getLinkEcocardiograma() { return linkEcocardiograma; }
    public void setLinkEcocardiograma(String linkEcocardiograma) { this.linkEcocardiograma = linkEcocardiograma; }

    public String getLinkLaboratorio() { return linkLaboratorio; }
    public void setLinkLaboratorio(String linkLaboratorio) { this.linkLaboratorio = linkLaboratorio; }

    public String getTieneOtroEstudio() { return tieneOtroEstudio; }
    public void setTieneOtroEstudio(String tieneOtroEstudio) { this.tieneOtroEstudio = tieneOtroEstudio; }

    public String getLinkOtroEstudio() { return linkOtroEstudio; }
    public void setLinkOtroEstudio(String linkOtroEstudio) { this.linkOtroEstudio = linkOtroEstudio; }

    public String getNombreOtroEstudio() { return nombreOtroEstudio; }
    public void setNombreOtroEstudio(String nombreOtroEstudio) { this.nombreOtroEstudio = nombreOtroEstudio; }

    public String getNivelRiesgo() { return nivelRiesgo; }
    public void setNivelRiesgo(String nivelRiesgo) { this.nivelRiesgo = nivelRiesgo; }

    public LocalDate getFechaCarga() { return fechaCarga; }
    public void setFechaCarga(LocalDate fechaCarga) { this.fechaCarga = fechaCarga; }
}