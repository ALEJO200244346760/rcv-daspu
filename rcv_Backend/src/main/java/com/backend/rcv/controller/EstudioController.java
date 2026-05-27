package com.backend.rcv.controller;

import com.backend.rcv.model.Estudio;
import com.backend.rcv.service.EstudioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estudios")
@CrossOrigin(origins = "*") // Ajustá al origen de tu frontend en producción
public class EstudioController {

    private final EstudioService service;

    public EstudioController(EstudioService service) {
        this.service = service;
    }

    // POST /api/estudios — guarda un nuevo estudio
    @PostMapping
    public ResponseEntity<Estudio> guardar(@RequestBody Estudio estudio) {
        if (estudio.getDni() == null || estudio.getDni().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if ((estudio.getLinkElectrocardiograma() == null || estudio.getLinkElectrocardiograma().isBlank()) &&
                (estudio.getLinkEcocardiograma() == null || estudio.getLinkEcocardiograma().isBlank())) {
            return ResponseEntity.badRequest().build();
        }
        Estudio guardado = service.guardar(estudio);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // GET /api/estudios/{dni} — devuelve el estudio más reciente del paciente
    @GetMapping("/{dni}")
    public ResponseEntity<Estudio> buscarPorDni(@PathVariable String dni) {
        try {
            Estudio estudio = service.buscarPorDni(dni);
            return ResponseEntity.ok(estudio);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}