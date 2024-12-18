import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, DownloadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProcedureDeleteDialog } from "./ProcedureDeleteDialog";
import { ProcedureAddDialog } from "./ProcedureAddDialog";
import axios from "axios";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { CustomResponse } from "@/app/beans/customResponse";
import BarLoader from "react-spinners/BarLoader";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { format } from "date-fns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ConstancyPDF from "./ConstancyPDF";
import { ConstancyDownloadDialog } from "./ConstancyPdfDialog";

interface TableDemoProps {
  filter?: string;
}

export function ProcedureTable({ filter }: TableDemoProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProcedureDTO[] | []>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureDTO>();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [procedureAddDialogOpen, setProcedureAddDialogOpen] = useState(false);
  const [showDownloadModal, setShowDonloadModal] = useState(false);

  useEffect(() => {
    const fetchProcedures = async () => {
      setLoading(true);

      try {
        const response = await axios.get<CustomResponse<ProcedureDTO[]>>(
          "/api/procedures"
        );

        setData(response.data.result || []);
      } catch (error) {
        console.error("Error fetching procedures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProcedures();
  }, []);

  const openDownloadModal = (procedureId: string) => {
    const procedure = data.find(
      (procedure) => procedure.id?.toString() === procedureId
    );

    setSelectedProcedure(procedure);
    setShowDonloadModal(true);
  };

  const openEditModal = (procedureId: string) => {
    const procedure = data.find(
      (procedure) => procedure.id?.toString() === procedureId
    );

    setSelectedProcedure(procedure);
    setShowModalEdit(true);
  };

  const openModal = (thesisId: string) => {
    const procedure = data.find(
      (procedure) => procedure.id?.toString() === thesisId
    );

    setSelectedProcedure(procedure);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedProcedure) {
      try {
        await axios.put(`/api/professors/${selectedProcedure.id}`);

        setData(
          data.filter((procedure) => procedure.id !== selectedProcedure.id)
        );
        setShowModal(false);
        setSelectedProcedure(undefined);
      } catch (error) {
        console.error("Error deleting procedure:", error);
      }
    }
  };

  return (
    <>
      <div className="max-h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Docente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
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
              data.map((procedure) => (
                <TableRow key={procedure.id}>
                  <TableCell>
                    {format(procedure.createdAt, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{procedure.professor?.user?.name}</TableCell>
                  <TableCell>
                    <div className="bg-orange-500 rounded-full px-2 py-1 text-center w-32 text-white">
                      {procedure.state?.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-4">
                      {/* <PDFDownloadLink
                        document={<ConstancyPDF data={data} />}
                        fileName="procedures.pdf"
                        children={
                          <DownloadIcon
                            className="cursor-pointer text-primary"
                            size={18}
                          />
                        }
                      ></PDFDownloadLink> */}

                      <DownloadIcon
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() => openDownloadModal(procedure.id!.toString())}
                      />
                      <Pencil
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() => openEditModal(procedure.id!.toString())}
                      />
                      <Trash2
                        className="cursor-pointer"
                        color="red"
                        size={18}
                        onClick={() => openModal(procedure.id!.toString())}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConstancyDownloadDialog
        isOpen={showDownloadModal}
        setIsOpen={setShowDonloadModal}
        procedure={selectedProcedure!}
      />

      <ProcedureAddDialog
        isOpen={procedureAddDialogOpen}
        setIsOpen={setProcedureAddDialogOpen}
        procedure={selectedProcedure}
      />
      <ProcedureDeleteDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
