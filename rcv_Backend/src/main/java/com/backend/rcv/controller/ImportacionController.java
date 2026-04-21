package com.backend.rcv.controller;

import com.backend.rcv.service.ImportacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/importar")
@CrossOrigin(origins = "*") // Importante para que el frontend pueda conectar
public class ImportacionController {

    @Autowired
    private ImportacionService importacionService;

    // Cambiamos el nombre de /csv a /excel para ser claros
    @PostMapping("/excel")
    public ResponseEntity<String> subirArchivoExcel(@RequestParam("file") MultipartFile file) {

        // Validación básica de formato
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }

        try {
            // Llamamos al nuevo método del servicio que usa Apache POI
            importacionService.importarDesdeExcel(file.getInputStream());

            return ResponseEntity.ok("Importación exitosa del archivo Excel.");
        } catch (Exception e) {
            // Imprimimos el error en consola para que puedas debuguear en Railway
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar el archivo Excel: " + e.getMessage());
        }
    }
}