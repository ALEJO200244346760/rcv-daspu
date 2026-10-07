package com.backend.rcv.service;

import com.backend.rcv.model.Estudio;
import com.backend.rcv.repository.EstudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstudioService {

    @Autowired
    private EstudioRepository repository;

    public List<Estudio> obtenerTodos() {
        return repository.findAll();
    }

    public Estudio guardar(Estudio estudio) {
        return repository.save(estudio);
    }

    public Optional<Estudio> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Estudio actualizar(Long id, Estudio datos) {
        return repository.findById(id).map(e -> {
            // Sección 1
            e.setNombreApellido(datos.getNombreApellido());
            e.setDni(datos.getDni());
            e.setFechaNacimiento(datos.getFechaNacimiento());
            e.setEdad(datos.getEdad());
            e.setTelefono(datos.getTelefono());
            e.setGenero(datos.getGenero());
            e.setTuvoHijos(datos.getTuvoHijos());
            e.setComplicacionesEmbarazo(datos.getComplicacionesEmbarazo());

            // Sección 2
            e.setEventosCv(datos.getEventosCv());

            // Sección 3
            e.setTomaMedicacion(datos.getTomaMedicacion());
            e.setHipertension(datos.getHipertension());
            e.setMedsHipertension(datos.getMedsHipertension());
            e.setOtroMedHipertension(datos.getOtroMedHipertension());
            e.setDiabetes(datos.getDiabetes());
            e.setMedsDiabetes(datos.getMedsDiabetes());
            e.setOtroMedDiabetes(datos.getOtroMedDiabetes());
            e.setColesterol(datos.getColesterol());
            e.setMedsColesterol(datos.getMedsColesterol());
            e.setOtroMedColesterol(datos.getOtroMedColesterol());
            e.setEstresAnsiedad(datos.getEstresAnsiedad());
            e.setEstresDetalle(datos.getEstresDetalle());
            e.setOtrasPatologias(datos.getOtrasPatologias());
            e.setOtrasPatologiasDetalle(datos.getOtrasPatologiasDetalle());
            e.setAntecedentesFamiliaresCardiopatia(datos.getAntecedentesFamiliaresCardiopatia()); // NUEVO

            // Sección 4
            e.setFuma(datos.getFuma());
            e.setFumoPorMucho(datos.getFumoPorMucho());
            e.setConsumeAlcohol(datos.getConsumeAlcohol());
            e.setDuerme68(datos.getDuerme68());
            e.setActividadFisica(datos.getActividadFisica());

            // Sección 5
            e.setSintomas(datos.getSintomas());
            e.setSintomaOtro(datos.getSintomaOtro());

            // Sección 6
            e.setPeso(datos.getPeso());
            e.setTalla(datos.getTalla());
            e.setCintura(datos.getCintura());
            e.setTensionSistolica(datos.getTensionSistolica());
            e.setTensionDiastolica(datos.getTensionDiastolica());
            e.setImc(datos.getImc());
            e.setImcClasificacion(datos.getImcClasificacion());
            e.setIct(datos.getIct());                   // NUEVO
            e.setIctCategoria(datos.getIctCategoria()); // NUEVO

            // Sección 7
            e.setLinkElectrocardiograma(datos.getLinkElectrocardiograma());
            e.setLinkEcocardiograma(datos.getLinkEcocardiograma());
            e.setLinkLaboratorio(datos.getLinkLaboratorio());
            e.setTieneOtroEstudio(datos.getTieneOtroEstudio());
            e.setLinkOtroEstudio(datos.getLinkOtroEstudio());
            e.setNombreOtroEstudio(datos.getNombreOtroEstudio());

            // Resultado
            e.setNivelRiesgo(datos.getNivelRiesgo());

            return repository.save(e);
        }).orElseThrow(() -> new RuntimeException("Estudio no encontrado con id: " + id));
    }
}