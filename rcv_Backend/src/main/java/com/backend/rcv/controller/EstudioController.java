package com.backend.rcv.controller;

import com.backend.rcv.model.Estudio;
import com.backend.rcv.service.EstudioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudios")
@CrossOrigin(origins = "*")
public class EstudioController {

    private final EstudioService service;

    public EstudioController(EstudioService service) {
        this.service = service;
    }

    // POST /api/estudios — guarda un nuevo registro
    @PostMapping
    public ResponseEntity<Estudio> guardar(@RequestBody Estudio estudio) {
        if (estudio.getDni() == null || estudio.getDni().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(estudio));
    }

    // PUT /api/estudios/{id} — actualiza links de un registro existente
    @PutMapping("/{id}")
    public ResponseEntity<Estudio> actualizar(@PathVariable Long id, @RequestBody Estudio datos) {
        try {
            return ResponseEntity.ok(service.actualizar(id, datos));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/estudios/{id} — elimina un registro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/estudios/todos/{dni} — devuelve TODOS los registros del DNI
    @GetMapping("/todos/{dni}")
    public ResponseEntity<List<Estudio>> buscarTodos(@PathVariable String dni) {
        try {
            return ResponseEntity.ok(service.buscarTodosPorDni(dni));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/estudios/{dni} — devuelve solo el más reciente (compatibilidad)
    @GetMapping("/{dni}")
    public ResponseEntity<Estudio> buscarMasReciente(@PathVariable String dni) {
        try {
            return ResponseEntity.ok(service.buscarMasRecientePorDni(dni));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}