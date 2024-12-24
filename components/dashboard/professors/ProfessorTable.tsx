import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { ProfessorDeleteDialog } from "./ProfessorDeleteDialog";
import { ProfessorAddDialog } from "./ProfessorAddDialog";
import BarLoader from "react-spinners/BarLoader";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";

export function ProfessorTable({
  professors,
  loading,
  onHandleProfessor,
  onDelete,
}: {
  professors: ProfessorDTO[];
  loading: boolean;
  onHandleProfessor: (updatedProfessor: ProfessorDTO) => void;
  onDelete: (deletedProfessor: ProfessorDTO) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorDTO>();
  const [showModalEdit, setShowModalEdit] = useState(false);

  const openEditModal = (professorId: number) => {
    const professor = professors.find(
      (professor) => professor.id === professorId
    );

    setSelectedProfessor(professor);
    setShowModalEdit(true);
  };

  const openModal = (professorId: number) => {
    const professor = professors.find(
      (professor) => professor.id === professorId
    );

    setSelectedProfessor(professor);
    setShowModal(true);
  };

  return (
    <>
      <div className="max-h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo Electrónico</TableHead>
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
              professors.map((professor) => (
                <TableRow key={professor.code}>
                  <TableCell>{professor.code}</TableCell>
                  <TableCell>{professor.user?.name}</TableCell>
                  <TableCell>{professor.user?.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-4">
                      <Pencil
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() => openEditModal(professor.id)}
                      />
                      <Trash2
                        className="cursor-pointer"
                        color="red"
                        size={18}
                        onClick={() => openModal(professor.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {/* TODO: AGREGAR PAGINACIÓN */}
          {/*
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                Total de registros
              </TableCell>
              <TableCell className="text-right">
                {filteredProfessors.length}
              </TableCell>
            </TableRow>
          </TableFooter>
          */}
        </Table>
      </div>

      <ProfessorAddDialog
        isOpen={showModalEdit}
        setIsOpen={setShowModalEdit}
        professor={selectedProfessor!}
        onHandleProfessor={onHandleProfessor}
      />
      <ProfessorDeleteDialog
        isOpen={showModal}
        setIsOpen={setShowModal}
        professor={selectedProfessor!}
        onDelete={onDelete}
      />
    </>
  );
}