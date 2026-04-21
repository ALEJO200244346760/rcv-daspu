package com.backend.rcv.service;

import com.backend.rcv.model.PacienteCircuito;
import com.backend.rcv.repository.PacienteCircuitoRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ImportacionService {

    @Autowired
    private PacienteCircuitoRepository repository;

    public void importarDesdeExcel(InputStream inputStream) throws Exception {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0); // Lee la primera hoja
        Iterator<Row> rows = sheet.iterator();

        List<PacienteCircuito> pacientes = new ArrayList<>();

        // Saltar encabezado si existe
        if (rows.hasNext()) rows.next();

        while (rows.hasNext()) {
            Row currentRow = rows.next();
            PacienteCircuito p = new PacienteCircuito();

            // Mapeo por índice de columna (Ajustar según tu Excel)
            // 0=Fecha, 1=Nombre, 2=DNI, 3=Eritrocitos...

            p.getPatientInfo().setNombreApellido(getCellValue(currentRow.getCell(1)));
            p.getPatientInfo().setDni(getCellValue(currentRow.getCell(2)));

            // Ejemplo para valores numéricos
            p.getLaboratorio().setHemoglobina(parseSafeDouble(getCellValue(currentRow.getCell(4))));
            p.getLaboratorio().setGlucemia(parseSafeDouble(getCellValue(currentRow.getCell(21))));

            pacientes.add(p);
        }

        repository.saveAll(pacientes);
        workbook.close();
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return "";
        }
    }

    private Double parseSafeDouble(String val) {
        try { return (val == null || val.isEmpty()) ? 0.0 : Double.parseDouble(val); }
        catch (Exception e) { return 0.0; }
    }
}