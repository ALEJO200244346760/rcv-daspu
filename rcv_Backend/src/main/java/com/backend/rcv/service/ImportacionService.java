package com.backend.rcv.service;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImportacionService {

    @Autowired
    private PacienteCircuitoRepository repository;

    public void importarDesdeExcel(InputStream inputStream) throws Exception {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0); // Primera hoja

        // Buscamos la fila de encabezados (usualmente la 1 o 2 dependiendo de tu Excel)
        // En tu archivo parece ser la fila 1 (índice 1) porque la 0 tiene grupos (HEMATOLOGIA, etc)
        Row headerRow = sheet.getRow(1);
        Map<String, Integer> headers = new HashMap<>();
        for (Cell cell : headerRow) {
            headers.put(cell.getStringCellValue().trim().toUpperCase(), cell.getColumnIndex());
        }

        List<PacienteCircuito> pacientes = new ArrayList<>();

        for (int i = 2; i <= sheet.getLastRowNum(); i++) { // Empezamos después de los encabezados
            Row row = sheet.getRow(i);
            if (row == null || isRowEmpty(row)) continue;

            PacienteCircuito p = new PacienteCircuito();

            // 1. Info Personal
            p.getPatientInfo().setNombreApellido(getVal(row, headers, "NOMBRE Y APELLIDO"));
            p.getPatientInfo().setDni(getVal(row, headers, "DNI"));
            p.getPatientInfo().setTelefono(getVal(row, headers, "TELEFONO"));
            p.getPatientInfo().setSexo(getVal(row, headers, "SEXO"));
            p.getPatientInfo().setFechaNacimiento(getVal(row, headers, "FECHA NACIMIENTO"));

            // 2. Examen Físico
            p.getExamenFisico().setPeso(parseSafeDouble(getVal(row, headers, "PESO")));
            p.getExamenFisico().setTalla(parseSafeDouble(getVal(row, headers, "TALLA")));
            p.getExamenFisico().setImc(parseSafeDouble(getVal(row, headers, "IMC")));
            p.getExamenFisico().setTensionArterial(getVal(row, headers, "TENSION ARTERIAL"));

            // 3. Laboratorio
            p.getLaboratorio().setHemoglobina(parseSafeDouble(getVal(row, headers, "HEMO GLOBINA")));
            p.getLaboratorio().setGlucemia(parseSafeDouble(getVal(row, headers, "GLUCEMIA")));
            p.getLaboratorio().setColesterolTotal(parseSafeDouble(getVal(row, headers, "COLESTROL TOTAL")));
            p.getLaboratorio().setLdl(parseSafeDouble(getVal(row, headers, "LDL")));
            p.getLaboratorio().setHdl(parseSafeDouble(getVal(row, headers, "HDL")));
            p.getLaboratorio().setTrigliceridos(parseSafeDouble(getVal(row, headers, "TRIGLI CERIDOS")));

            // 4. Antecedentes
            p.getAntecedentesPersonales().setDiabetes(parseBoolean(getVal(row, headers, "DIABETES")));
            p.getAntecedentesPersonales().setHipertension(parseBoolean(getVal(row, headers, "HIPERTENSIÓN")));

            pacientes.add(p);
        }

        repository.saveAll(pacientes);
        workbook.close();
    }

    private String getVal(Row row, Map<String, Integer> headers, String columnName) {
        Integer columnIndex = headers.get(columnName.toUpperCase());
        if (columnIndex == null) return "";
        Cell cell = row.getCell(columnIndex);
        if (cell == null) return "";

        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell);
    }

    private Double parseSafeDouble(String val) {
        try {
            if (val == null || val.isEmpty()) return 0.0;
            return Double.parseDouble(val.replace(",", "."));
        } catch (Exception e) { return 0.0; }
    }

    private Boolean parseBoolean(String val) {
        return val != null && (val.equalsIgnoreCase("SI") || val.equalsIgnoreCase("1") || val.equalsIgnoreCase("TRUE"));
    }

    private boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) return false;
        }
        return true;
    }
}