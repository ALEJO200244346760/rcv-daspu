package com.backend.rcv.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "estudios")
public class Estudio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dni;

    @Column(name = "link_electrocardiograma", length = 1000)
    private String linkElectrocardiograma;

    @Column(name = "link_ecocardiograma", length = 1000)
    private String linkEcocardiograma;

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

    public String getLinkElectrocardiograma() { return linkElectrocardiograma; }
    public void setLinkElectrocardiograma(String linkElectrocardiograma) {
        this.linkElectrocardiograma = linkElectrocardiograma;
    }

    public String getLinkEcocardiograma() { return linkEcocardiograma; }
    public void setLinkEcocardiograma(String linkEcocardiograma) {
        this.linkEcocardiograma = linkEcocardiograma;
    }

    public LocalDateTime getFechaCarga() { return fechaCarga; }
    public void setFechaCarga(LocalDateTime fechaCarga) { this.fechaCarga = fechaCarga; }
}
