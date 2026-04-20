package com.backend.rcv.controller;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import com.backend.rcv.service.ImportacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/circuito")
@CrossOrigin(origins = "*")
public class PacienteCircuitoController {

    @Autowired
    private PacienteCircuitoRepository repository;

    @Autowired
    private ImportacionService importacionService;

    @PostMapping("/recibir")
    public ResponseEntity<?> recibirDatos(@RequestBody PacienteCircuito datos) {
        try {
            return ResponseEntity.ok(repository.save(datos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar: " + e.getMessage());
        }
    }

    @PostMapping("/importar-csv")
    public ResponseEntity<String> importarCSV(@RequestParam("file") MultipartFile file) {
        try {
            importacionService.importarDesdeCSV(file.getInputStream());
            return ResponseEntity.ok("Importación exitosa.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar CSV: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<PacienteCircuito> lista = repository.findAll();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener datos: " + e.getMessage());
        }
    }
}