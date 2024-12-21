import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, DownloadIcon } from "lucide-react";
import React, { useState } from "react";
import { ProcedureEditDialog } from "./ProcedureEditDialog";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import BarLoader from "react-spinners/BarLoader";
import { format } from "date-fns";
import { ConstancyDownloadDialog } from "./ConstancyPdfDialog";

export function ProcedureTable({
  procedures,
  loading,
  onEditProcedure,
}: {
  procedures: ProcedureDTO[];
  loading: boolean;
  onEditProcedure: (updatedProcedure: ProcedureDTO) => void;
}) {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureDTO>();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showDownloadModal, setShowDonloadModal] = useState(false);

  const openDownloadModal = (procedureId: string) => {
    const procedure = procedures.find(
      (procedure) => procedure.id?.toString() === procedureId
    );

    setSelectedProcedure(procedure);
    setShowDonloadModal(true);
  };

  const openEditModal = (procedureId: number) => {
    const procedure = procedures.find(
      (procedure) => procedure.id === procedureId
    );

    setSelectedProcedure(procedure);
    setShowModalEdit(true);
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
              procedures.map((procedure) => (
                <TableRow key={procedure.id}>
                  <TableCell>
                    {format(procedure.createdAt, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{procedure.professor?.user?.name}</TableCell>
                  <TableCell>
                    <div
                      className={`rounded-full px-2 py-1 text-center w-52 text-white ${
                        procedure.state?.id === 1
                          ? "bg-yellow-500" // En proceso
                          : procedure.state?.id === 3
                          ? "bg-green-500" // Descargado
                          : procedure.state?.id === 4
                          ? "bg-orange-500" // Firmado
                          : procedure.state?.id === 5
                          ? "bg-gray-400" // Entregado
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      {procedure.state?.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-4">
                      <DownloadIcon
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() =>
                          openDownloadModal(procedure.id!.toString())
                        }
                      />
                      <Pencil
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() => openEditModal(procedure.id!)}
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
      <ProcedureEditDialog
        isOpen={showModalEdit}
        setIsOpen={setShowModalEdit}
        procedure={selectedProcedure}
        onEditProcedure={onEditProcedure}
      />
    </>
  );
}
