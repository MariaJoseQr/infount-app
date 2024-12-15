import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProfessorDeleteDialog } from "./ProfessorDeleteDialog";
import { ProfessorAddDialog } from "./ProfessorAddDialog";
import axios from "axios";
import { ProfessorReq } from "@/app/beans/request/professorReq";
import { CustomResponse } from "@/app/beans/customResponse";
import BarLoader from "react-spinners/BarLoader";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";

interface TableDemoProps {
  filter?: string;
}

export function ProfessorTable({ filter }: TableDemoProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfessorReq[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] =
    useState<ProfessorReq | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    const fetchTheses = async () => {
      setLoading(true);

      try {
        const response = await axios.get<CustomResponse<ProfessorDTO[]>>(
          "/api/professors"
        );

        console.log("response: ", response);
        const mappedData =
          response.data.result?.map((professor) => ({
            id: professor.id,
            name: professor.user?.name || "",
            email: professor.user?.email || "",
            cellphone: professor.user?.cellphone || "",
            code: professor.code || "",
            gradeId: professor.grade?.id || 0,
          })) || [];

        setData(mappedData);
      } catch (error) {
        console.error("Error fetching professors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheses();
  }, []);

  const openEditModal = (professorIdEdit: string) => {
    const professor = data.find(
      (professor) => professor.id?.toString() === professorIdEdit
    );

    setSelectedProfessor(professor || null);
    setShowModalEdit(true);
  };

  const openModal = (thesisId: string) => {
    const professor = data.find(
      (professor) => professor.id?.toString() === thesisId
    );

    setSelectedProfessor(professor || null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedProfessor) {
      try {
        await axios.put(`/api/professors/${selectedProfessor.id}`);

        setData(
          data.filter((professor) => professor.id !== selectedProfessor.id)
        );
        setShowModal(false);
        setSelectedProfessor(null);
      } catch (error) {
        console.error("Error deleting professor:", error);
      }
    }
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
              data.map((professor) => (
                <TableRow key={professor.code}>
                  <TableCell>{professor.code}</TableCell>
                  <TableCell>{professor.name}</TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-4">
                      <Pencil
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() => openEditModal(professor.id!.toString())}
                      />
                      <Trash2
                        className="cursor-pointer"
                        color="red"
                        size={18}
                        onClick={() => openModal(professor.id!.toString())}
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
      />
      <ProfessorDeleteDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
