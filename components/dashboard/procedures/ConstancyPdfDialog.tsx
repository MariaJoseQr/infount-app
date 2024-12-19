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
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import { Button } from "@/components/ui/button";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { ProcedureReq } from "@/app/beans/request/procedureReq";


export function ConstancyDownloadDialog({
  isOpen,
  setIsOpen,
  procedure
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  procedure: ProcedureDTO;
}) {
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState<ThesisDTO[]>([]);
  const [procedureConstancy, setData] = useState<ProcedureDTO>();

  const pdfRef = useRef();
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
      const imgY = 10;

      pdf.addImage(imgData, "PNG", imgX, imgY, scaledWidth, scaledHeight);

      pdf.save("document.pdf");

      if (procedure.state?.id == 1) {
        const req: ProcedureReq = {
          id: procedure.id!,
          state: { "id": 3 }
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

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-md max-h-[85vh] overflow-y-auto"
        style={{ clipPath: "inset(0 round 0.45rem)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-primary">
            {"Constancia Docente"}
          </DialogTitle>
          <DialogDescription>
            {"Descripcion v: Constacia a descargar"}
          </DialogDescription>
        </DialogHeader>

        {/* <button className="btn btn-primary" onClick={downloadPDF}>Exportar PDF</button> */}
        <div ref={pdfRef} className="max-h-full">
          {"Docente: " + procedureConstancy?.professor.user?.name}
          {"File Number : " + procedureConstancy?.constancy?.fileNumber}
          {"Registration number : " + procedureConstancy?.constancy?.registrationNumber}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Resolución</TableHead>
                <TableHead>Nombre de la Tesis</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                    <TableCell>{thesis.resolutionCode}</TableCell>
                    <TableCell>{thesis.name}</TableCell>
                    <TableCell>{thesis.type?.name}</TableCell>
                    <TableCell>{thesis.charge.name}</TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={downloadPDF}>
            {"Exportar pdf"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>


  );
}
