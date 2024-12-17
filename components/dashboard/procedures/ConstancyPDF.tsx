import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

// Estilos para el PDF usando @react-pdf/renderer
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  subHeader: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRight: "1px solid #ddd",
  },
  tableCellLast: {
    padding: 5,
    fontSize: 10,
  },
});

const ConstancyPDF = ({ data }: { data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        FACULTAD DE CIENCIAS FÍSICAS Y MATEMÁTICAS
      </Text>
      <Text style={styles.subHeader}>
        Escuela Profesional de Ingeniería Informática
      </Text>
      <View style={styles.table}>
        {/* Cabecera de la tabla */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "25%" }]}>Fecha</Text>
          <Text style={[styles.tableCell, { width: "35%" }]}>Docente</Text>
          <Text style={[styles.tableCellLast, { width: "40%" }]}>Estado</Text>
        </View>
        {/* Filas de la tabla */}
        {data.map((procedure) => (
          <View key={procedure.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {format(procedure.createdAt, "dd/MM/yyyy")}
            </Text>
            <Text style={[styles.tableCell, { width: "35%" }]}>
              {procedure.professor?.user?.name}
            </Text>
            <Text style={[styles.tableCellLast, { width: "40%" }]}>
              {procedure.state?.name}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ConstancyPDF;
