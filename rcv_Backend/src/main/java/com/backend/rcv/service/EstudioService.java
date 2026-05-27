package com.backend.rcv.service;

import com.backend.rcv.model.Estudio;
import com.backend.rcv.repository.EstudioRepository;
import org.springframework.stereotype.Service;

@Service
public class EstudioService {

    private final EstudioRepository repository;

    public EstudioService(EstudioRepository repository) {
        this.repository = repository;
    }

    public Estudio guardar(Estudio estudio) {
        return repository.save(estudio);
    }

    public Estudio buscarPorDni(String dni) {
        return repository.findTopByDniOrderByFechaCargaDesc(dni)
                .orElseThrow(() -> new RuntimeException("No se encontraron estudios para el DNI: " + dni));
    }
}