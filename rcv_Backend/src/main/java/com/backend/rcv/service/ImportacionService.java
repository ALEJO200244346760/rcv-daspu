package com.backend.rcv.service;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImportacionService {

    @Autowired
    private PacienteCircuitoRepository repository;

    public void importarDesdeCSV(InputStream inputStream) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                .withFirstRecordAsHeader()
                .withIgnoreHeaderCase()
                .withTrim());

        List<PacienteCircuito> pacientes = new ArrayList<>();

        for (CSVRecord record : csvParser) {
            PacienteCircuito p = new PacienteCircuito();

            // Info Personal
            p.getPatientInfo().setNombreApellido(record.get("NOMBRE Y APELLIDO"));
            p.getPatientInfo().setDni(record.get("DNI"));
            p.getPatientInfo().setTelefono(record.get("TELEFONO"));
            p.getPatientInfo().setSexo(record.get("SEXO"));
            p.getPatientInfo().setFechaNacimiento(record.get("FECHA NACIMIENTO"));

            // Examen Físico
            p.getExamenFisico().setPeso(parseSafeDouble(record.get("PESO")));
            p.getExamenFisico().setTalla(parseSafeDouble(record.get("TALLA")));
            p.getExamenFisico().setTensionArterial(record.get("TENSION ARTERIAL"));
            p.getExamenFisico().setImc(parseSafeDouble(record.get("IMC")));

            // Laboratorio
            p.getLaboratorio().setHemoglobina(parseSafeDouble(record.get("HEMO GLOBINA")));
            p.getLaboratorio().setGlucemia(parseSafeDouble(record.get("GLUCEMIA")));
            p.getLaboratorio().setColesterolTotal(parseSafeDouble(record.get("COLESTROL TOTAL")));
            p.getLaboratorio().setLdl(parseSafeDouble(record.get("LDL")));
            p.getLaboratorio().setHdl(parseSafeDouble(record.get("HDL")));
            p.getLaboratorio().setTrigliceridos(parseSafeDouble(record.get("TRIGLI CERIDOS")));

            // Antecedentes
            p.getAntecedentesPersonales().setDiabetes(parseBoolean(record.get("DIABETES")));
            p.getAntecedentesPersonales().setHipertension(parseBoolean(record.get("HIPERTENSIÓN")));

            pacientes.add(p);
        }

        repository.saveAll(pacientes);
        csvParser.close();
    }

    private Double parseSafeDouble(String val) {
        try { return (val == null || val.isEmpty()) ? 0.0 : Double.parseDouble(val.replace(",", ".")); }
        catch (Exception e) { return 0.0; }
    }

    private Boolean parseBoolean(String val) {
        return val != null && (val.equalsIgnoreCase("SI") || val.equalsIgnoreCase("1") || val.equalsIgnoreCase("TRUE"));
    }
}