import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";
import { CustomResponse } from "@/app/beans/customResponse";
import BarLoader from "react-spinners/BarLoader";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

export function ConstancyDownloadDialog({
  isOpen,
  setIsOpen,
  // procedure
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // procedure: ProcedureDTO; 
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ThesisDTO[]>([]);
  const pdfRef = useRef();
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('invoice.pdf');
    });
  }

  useEffect(() => {
    const fetchTheses = async () => {
      setLoading(true);

      try {
        const response = await axios.get<CustomResponse<ThesisDTO[]>>(
          "/api/thesis"
        );

        setData(response.data.result || []);
      } catch (error) {
        console.error("Error fetching theses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheses();
  }, []);




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

        <button className="btn btn-primary" onClick={downloadPDF}>Exportar PDF</button>
        <div ref={pdfRef} className="max-h-full">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Resolución</TableHead>
                <TableHead>Nombre de la Tesis</TableHead>
                <TableHead>Tipo</TableHead>
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
                data.map((thesis) => (
                  <TableRow key={thesis.name}>
                    <TableCell>{thesis.resolutionCode}</TableCell>
                    <TableCell>{thesis.name}</TableCell>
                    <TableCell>{thesis.type?.name}</TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>
      </DialogContent>
    </Dialog>


  );
}
