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
        Estudio e = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudio no encontrado: " + id));

        // Sección 1
        e.setNombreApellido(datos.getNombreApellido());
        e.setFechaNacimiento(datos.getFechaNacimiento());
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

        // Sección 7
        e.setLinkElectrocardiograma(datos.getLinkElectrocardiograma());
        e.setLinkEcocardiograma(datos.getLinkEcocardiograma());
        e.setLinkLaboratorio(datos.getLinkLaboratorio());
        e.setNombreOtroEstudio(datos.getNombreOtroEstudio());
        e.setLinkOtroEstudio(datos.getLinkOtroEstudio());

        return repository.save(e);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public List<Estudio> listarTodos() {
        return repository.findAllByOrderByFechaCargaDesc();
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