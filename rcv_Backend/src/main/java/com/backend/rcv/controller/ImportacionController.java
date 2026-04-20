package com.backend.rcv.controller;

import com.backend.rcv.service.ImportacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

@RestController
@RequestMapping("/api/importar")
public class ImportacionController {

    @Autowired
    private ImportacionService importacionService;

    @PostMapping("/csv")
    public ResponseEntity<String> subirArchivo(@RequestParam("file") MultipartFile file) {
        try {
            importacionService.importarDesdeCSV(file.getInputStream());
            return ResponseEntity.ok("Importación exitosa de todos los pacientes.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al procesar el archivo: " + e.getMessage());
        }
    }
}