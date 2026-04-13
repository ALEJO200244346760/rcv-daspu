package com.backend.rcv.controller;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/circuito")
@CrossOrigin(origins = "*")
public class PacienteCircuitoController {

    @Autowired
    private PacienteCircuitoRepository repository;

    @PostMapping("/recibir")
    public ResponseEntity<?> recibirDatos(@RequestBody PacienteCircuito datos) {

        if (datos.getAttachments() == null) {
            datos.setAttachments(new ArrayList<>());
        }

        return ResponseEntity.ok(repository.save(datos));
    }

    @GetMapping("/listar")
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<PacienteCircuito> lista = repository.findAll();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener datos: " + e.getMessage());
        }
    }
}