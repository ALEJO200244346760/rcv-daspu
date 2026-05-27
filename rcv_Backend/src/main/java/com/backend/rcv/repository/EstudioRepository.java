package com.backend.rcv.repository;

import com.backend.rcv.model.Estudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstudioRepository extends JpaRepository<Estudio, Long> {

    // Devuelve el estudio más reciente por DNI
    Optional<Estudio> findTopByDniOrderByFechaCargaDesc(String dni);
}