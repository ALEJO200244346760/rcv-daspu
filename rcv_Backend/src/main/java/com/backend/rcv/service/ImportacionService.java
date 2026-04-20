package com.backend.rcv.service;

// 1. Modelos y Repositorio
import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import com.backend.rcv.repository.PacienteRepository;

// 2. Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// 3. Apache Commons CSV (Asegurate de tener la dependencia en el pom.xml)
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

// 4. Utilidades de Java (IO y Collections)
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImportacionService {

    @Autowired
    private PacienteCircuitoRepository repository; // Asegurate que el nombre coincida con la interfaz que acabas de crear
    
    public void importarDesdeCSV(InputStream inputStream) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                .withFirstRecordAsHeader()
                .withIgnoreHeaderCase()
                .withTrim());

        List<PacienteCircuito> pacientes = new ArrayList<>();

        for (CSVRecord record : csvParser) {
            PacienteCircuito p = new PacienteCircuito();
            
            // 1. Info Personal
            PacienteCircuito.PatientInfo info = new PacienteCircuito.PatientInfo();
            info.setNombreApellido(record.get("NOMBRE Y APELLIDO"));
            info.setDni(record.get("DNI"));
            info.setTelefono(record.get("TELEFONO"));
            info.setSexo(record.get("SEXO"));
            info.setFechaNacimiento(record.get("FECHA NACIMIENTO"));
            p.setPatientInfo(info);

            // 2. Examen Físico
            PacienteCircuito.ExamenFisico fisico = new PacienteCircuito.ExamenFisico();
            fisico.setPeso(parseSafeDouble(record.get("PESO")));
            fisico.setTalla(parseSafeDouble(record.get("TALLA")));
            fisico.setTensionArterial(record.get("TENSION ARTERIAL"));
            fisico.setImc(parseSafeDouble(record.get("IMC")));
            p.setExamenFisico(fisico);

            // 3. Laboratorio (Hemograma)
            PacienteCircuito.LaboratorioDetallado lab = new PacienteCircuito.LaboratorioDetallado();
            lab.setHemoglobina(parseSafeDouble(record.get("HEMO GLOBINA")));
            lab.setGlucemia(parseSafeDouble(record.get("GLUCEMIA")));
            lab.setColesterolTotal(parseSafeDouble(record.get("COLESTROL TOTAL")));
            lab.setLdl(parseSafeDouble(record.get("LDL")));
            lab.setHdl(parseSafeDouble(record.get("HDL")));
            lab.setTrigliceridos(parseSafeDouble(record.get("TRIGLI CERIDOS")));
            p.setLaboratorio(lab);

            // 4. Antecedentes (Booleanos)
            PacienteCircuito.AntecedentesPersonales ant = new PacienteCircuito.AntecedentesPersonales();
            ant.setDiabetes(parseBoolean(record.get("DIABETES")));
            ant.setHipertension(parseBoolean(record.get("HIPERTENSIÓN")));
            p.setAntecedentesPersonales(ant);

            pacientes.add(p);
        }

        repository.saveAll(pacientes);
        csvParser.close();
    }

    // Métodos auxiliares para evitar errores si el CSV tiene campos vacíos
    private Double parseSafeDouble(String val) {
        try { return (val == null || val.isEmpty()) ? 0.0 : Double.parseDouble(val.replace(",", ".")); }
        catch (Exception e) { return 0.0; }
    }

    private Boolean parseBoolean(String val) {
        return val != null && (val.equalsIgnoreCase("SI") || val.equalsIgnoreCase("1") || val.equalsIgnoreCase("TRUE"));
    }
}