package com.backend.rcv.repository;

import com.backend.rcv.model.Estudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudioRepository extends JpaRepository<Estudio, Long> {

    // Todos los registros de un DNI, del más reciente al más antiguo
    List<Estudio> findByDniOrderByFechaCargaDesc(String dni);

    // El más reciente (para compatibilidad con el endpoint original)
    Optional<Estudio> findTopByDniOrderByFechaCargaDesc(String dni);
}