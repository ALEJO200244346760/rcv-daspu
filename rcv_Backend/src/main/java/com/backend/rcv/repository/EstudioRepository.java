package com.backend.rcv.repository;

import com.backend.rcv.model.Estudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudioRepository extends JpaRepository<Estudio, Long> {
    List<Estudio> findAllByOrderByFechaCargaDesc();
    List<Estudio> findByDniOrderByFechaCargaDesc(String dni);
    Optional<Estudio> findTopByDniOrderByFechaCargaDesc(String dni);
}