import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import BarLoader from "react-spinners/BarLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { ProcedureReq } from "@/app/beans/request/procedureReq";
import { format } from "date-fns";

export function ConstancyDownloadDialog({
  isOpen,
  setIsOpen,
  procedure,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  procedure: ProcedureDTO;
}) {
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState<ThesisDTO[]>([]);
  const [procedureConstancy, setData] = useState<ProcedureDTO>();

  const pdfRef = useRef<HTMLDivElement | null>(null);

  const downloadPDF = () => {
    const input = pdfRef.current;

    if (!input) return;

    html2canvas(input, {
      scale: 3,
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      const imgX = (pdfWidth - scaledWidth) / 2;
      const imgY = 5;

      pdf.addImage(imgData, "PNG", imgX, imgY, scaledWidth, scaledHeight);

      pdf.save("document.pdf");

      if (procedure.state?.id == 1) {
        const req: ProcedureReq = {
          id: procedure.id!,
          state: { id: 3 },
        };
        axios
          .put("/api/procedures", req)
          .then((response) => {
            if (response.data.resultType == ResultType.OK)
              console.log("ACTUALIZACION EXITOSA");
            else {
              console.log("ERROR/ADVERTENCIA AL ACTUALIZAR");
            }
          })
          .catch((error) =>
            console.error("Error obteniendo al actualizar tesis:", error)
          );
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      const fetchTheses = async () => {
        setLoading(true);
        try {
          const response = await axios.get<CustomResponse<ProcedureDTO>>(
            "/api/procedures/" + procedure.id
          );

          setData(response.data.result!);
        } catch (error) {
          console.error("Error fetching theses:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTheses();
    }
  }, [isOpen, procedure]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="md:max-w-2xl max-h-[85vh]"
          style={{ clipPath: "inset(0 round 0.45rem)" }}
        >
          <DialogHeader>
            <DialogTitle className="text-primary">
              Constancia Generada
            </DialogTitle>
            <DialogDescription>
              La constancia ha sido generad font-semiboa con éxito. Presiona el
              botón para iniciar la descarga del documento.
            </DialogDescription>
          </DialogHeader>

          <div className="border mt-2 max-h-[35vh] overflow-y-auto overflow-x-auto">
            <div ref={pdfRef} className="grid text-black gap-4 p-8">
              <div className="text-center">
                <p className="text-md font-serif">
                  FACULTAD DE CIENCIAS FÍSICAS Y MATEMÁTICAS
                </p>
                <p className="text-sm font-serif">
                  Escuela Profesional de Ingeniería Informática
                </p>

                <div className="border-t-2 border-black w-full my-6 mx-auto"></div>

                <p className="text-xs font-serif italic my-4">
                  "Dos siglos de sabiduría, un legado para el futuro"
                </p>
                <p className="text-xs font-sans font-semibold underline underline-offset-2">
                  CONSTANCIA DE ASESORÍA Y/O EVALUACIÓN DE TRABAJOS DE
                  INVESTIGACIÓN
                </p>
              </div>
              <p className="text-xs pt-4">
                EL DIRECTOR DE LA ESCUELA PROFESIONAL DE INFORMÁTICA, FACULTAD
                DE CIENCIAS FÍSICAS Y MATEMÁTICAS DE LA UNIVERSIDAD NACIONAL DE
                TRUJILLO, que suscribe:
              </p>
              <p className="flex text-xs font-semibold">HACE CONSTAR:</p>
              <p className="text-xs text-justify">
                Que, el/la recurrente
                <span className="px-1">
                  {procedureConstancy?.professor?.grade?.abbreviation}
                </span>
                <span className="pr-1">
                  {procedureConstancy?.professor?.user?.name}
                </span>
                , es docente del Departamento Académico de INFORMÁTICA, con
                código
                <span className="px-1">
                  {procedureConstancy?.professor?.code}, ha sido jurado de
                  evaluación de Informe de Tesis/Trabajos de Suficiencia
                  Profesional/Trabajos de Graduación realizados por los alumnos
                  en esta escuela.
                </span>
              </p>

              <Table className="border">
                <TableHeader className="text-xs/6">
                  <TableRow>
                    <TableHead className="text-center font-semibold text-black">
                      TÍTULO DE TESIS Y/O INF. SUF. PROFESIONAL
                    </TableHead>
                    <TableHead className="text-center font-semibold text-black">
                      BACHILLER
                    </TableHead>
                    <TableHead className="text-center font-semibold text-black">
                      RESOLUCIÓN DIRECTORAL Y/O DECANAL
                    </TableHead>
                    <TableHead className="text-center font-semibold text-black">
                      CARGO EN EL JURADO
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-0">
                        <div className="flex w-full">
                          <BarLoader color="#2C3E81" width="100%" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    procedureConstancy?.constancy?.thesis!.map((thesis) => (
                      <TableRow key={thesis.name}>
                        <TableCell className="max-w-16">
                          {thesis.name}
                        </TableCell>
                        <TableCell className="w-32 items-center">
                          <p>{thesis.firstStudentName}</p>
                          {thesis.secondStudentName ? (
                            <p>{thesis.secondStudentName}</p>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell className="text-center w-24">
                          {thesis.resolutionCode}
                        </TableCell>
                        <TableCell className="text-center w-20">
                          {thesis.charge.name}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <p className="text-xs text-justify">
                Así consta en los archivos y demás documentos a cargo de esta
                Dirección, por lo que a solicitud de la parte interesada se
                expide la presente constancia en la ciudad de Trujillo con fecha
                <span className="pl-1">
                  {procedureConstancy?.createdAt
                    ? format(procedureConstancy.createdAt, "yyyy-MM-dd")
                    : "Fecha no disponible"}
                </span>
                .
              </p>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  <p className="text-xs text-justify">
                    N° Expediente:
                    <span className="px-1">
                      {procedureConstancy?.constancy?.fileNumber}
                    </span>
                  </p>
                  <p className="text-xs text-justify">
                    N° Registro:
                    <span className="px-1">
                      {procedureConstancy?.constancy?.registrationNumber}
                    </span>
                  </p>
                </div>
                <div className="w-48">
                  <div className="border-t-2 border-black w-40 mt-10 mb-1 mx-auto"></div>
                  <p className="text-xs text-center font-semibold">
                    Ms. José Gabriel Cruz Silva
                  </p>
                  <p className="text-xs text-center">
                    Director de la Escuela Profesional de Ingeniería Informática
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-black w-full mt-6 mx-auto"></div>

              <div className="flex justify-between items-center">
                <p className="text-xs mt-0">
                  Correo: informatica@unitru.edu.pe
                </p>
                <p className="text-xs mt-0">
                  Ciudad Universitaria: Av. Juan Pablo II s/n
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={downloadPDF}>Descargar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
