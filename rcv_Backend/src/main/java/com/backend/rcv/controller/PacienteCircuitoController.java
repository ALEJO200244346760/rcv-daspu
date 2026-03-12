package com.backend.rcv.controller;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/circuito")
@CrossOrigin(origins = "*") // Permite pruebas iniciales desde cualquier origen
public class PacienteCircuitoController {

    @Autowired
    private PacienteCircuitoRepository repository;

    @PostMapping("/recibir")
    public ResponseEntity<?> recibirDatos(@RequestBody PacienteCircuito datos) {
        try {
            // Guardamos el objeto completo que viene del sistema Amanda
            PacienteCircuito guardado = repository.save(datos);

            // Log para que veas en la consola de Railway que entró la info
            System.out.println("Datos de Amanda recibidos para: " + datos.getPatientInfo().getName());

            return new ResponseEntity<>(guardado, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error al procesar los datos: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}