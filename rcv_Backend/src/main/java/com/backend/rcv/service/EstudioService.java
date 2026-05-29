package com.backend.rcv.service;

import com.backend.rcv.model.Estudio;
import com.backend.rcv.repository.EstudioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstudioService {

    private final EstudioRepository repository;

    public EstudioService(EstudioRepository repository) {
        this.repository = repository;
    }

    public Estudio guardar(Estudio estudio) {
        return repository.save(estudio);
    }

    public Estudio actualizar(Long id, Estudio datos) {
        Estudio existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudio no encontrado: " + id));
        // Actualizamos solo los links y nombre (lo que permite el modal de edición)
        existente.setLinkElectrocardiograma(datos.getLinkElectrocardiograma());
        existente.setLinkEcocardiograma(datos.getLinkEcocardiograma());
        existente.setLinkLaboratorio(datos.getLinkLaboratorio());
        existente.setNombreOtroEstudio(datos.getNombreOtroEstudio());
        existente.setLinkOtroEstudio(datos.getLinkOtroEstudio());
        return repository.save(existente);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public List<Estudio> buscarTodosPorDni(String dni) {
        List<Estudio> lista = repository.findByDniOrderByFechaCargaDesc(dni);
        if (lista.isEmpty()) throw new RuntimeException("No se encontraron estudios para el DNI: " + dni);
        return lista;
    }

    public Estudio buscarMasRecientePorDni(String dni) {
        return repository.findTopByDniOrderByFechaCargaDesc(dni)
                .orElseThrow(() -> new RuntimeException("No se encontraron estudios para el DNI: " + dni));
    }
}