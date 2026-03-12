package com.backend.rcv.controller;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/circuito")
// Ya tenés la WebConfig para el CORS, pero esto refuerza por las dudas:
@CrossOrigin(origins = "*")
public class PacienteCircuitoController {

    @Autowired
    private PacienteCircuitoRepository repository;

    @PostMapping("/recibir")
    public ResponseEntity<?> recibirDatos(@RequestBody PacienteCircuito datos) {
        try {
            // Sin service: guardamos directo usando el repository
            PacienteCircuito guardado = repository.save(datos);
            return new ResponseEntity<>(guardado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}