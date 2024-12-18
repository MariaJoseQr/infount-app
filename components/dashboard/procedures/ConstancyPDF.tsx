import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  subHeaderText: {
    textAlign: "center",
    fontSize: 10,
  },
  phrase: {
    textAlign: "center",
    fontSize: 9,
    marginTop: 10,
    marginBottom: 20,
    fontStyle: "italic",
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
    fontSize: 8,
    borderRight: "1px solid #ddd",
  },
  tableCellLast: {
    padding: 5,
    fontSize: 8,
  },
  footer: {
    marginTop: 20,
    fontSize: 9,
    textAlign: "center",
  },
  signature: {
    marginTop: 40,
    fontSize: 10,
    textAlign: "right",
    marginRight: 50,
  },
});

const ConstancyPDF = ({ data }: { data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logos */}
      <View style={styles.headerContainer}>
        <Image style={styles.logo} src="/unt.png" />
        <View>
          <Text style={styles.headerText}>
            UNIVERSIDAD NACIONAL DE TRUJILLO
          </Text>
          <Text style={styles.headerText}>
            FACULTAD DE CIENCIAS FÍSICAS Y MATEMÁTICAS
          </Text>
          <Text style={styles.subHeaderText}>
            Escuela Profesional de Ingeniería Informática
          </Text>
        </View>
        <Image style={styles.logo} src="unt.png" />
      </View>

      {/* Frase */}
      <Text style={styles.phrase}>
        "Dos siglos de sabiduría, un legado para el futuro"
      </Text>

      {/* Título */}
      <Text style={[styles.headerText, { marginBottom: 10 }]}>
        CONSTANCIA DE ASESORÍA Y/O EVALUACIÓN DE INFORME DE TESIS Y/O INFORMES
        DE SUFICIENCIA PROFESIONAL
      </Text>

      {/* Tabla */}
      <View style={styles.table}>
        {/* Cabecera de la tabla */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "30%" }]}>
            Título de Tesis y/o Inf. Suf. Profesional
          </Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Bachiller</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>
            Fecha de Sustentación
          </Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Resolución</Text>
          <Text style={[styles.tableCellLast, { width: "15%" }]}>Cargo</Text>
        </View>

        {/* Filas dinámicas */}
        {data.map((row) => (
          <View key={row.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {row.titulo}
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>
              {row.bachiller}
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              {row.fecha}
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>
              {row.resolucion}
            </Text>
            <Text style={[styles.tableCellLast, { width: "15%" }]}>
              {row.cargo}
            </Text>
          </View>
        ))}
      </View>

      {/* Firmas */}
      <Text style={styles.signature}>Director de la Escuela Profesional</Text>
      <Text style={styles.footer}>
        Es copia fiel del original, dirigido a quien corresponda.
      </Text>
    </Page>
  </Document>
);

export default ConstancyPDF;
