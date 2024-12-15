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
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";
import { CustomResponse } from "@/app/beans/customResponse";
import BarLoader from "react-spinners/BarLoader";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";

interface TableDemoProps {
  filter?: string;
}

export interface Thesis {
  id: number;
  resolutionCode: string;
  name: string;
  type: { name: string };
  firstStudentName?: string;
  secondStudentName?: string;
  date?: string;
  professorsThesis: {
    professor: { user: { name: string } };
    charge: { name: string };
  }[];
}

export function ProfessorTable({ filter }: TableDemoProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfessorDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<ThesisDTO | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    const fetchTheses = async () => {
      setLoading(true);

      try {
        const response = await axios.get<CustomResponse<ProfessorDTO[]>>(
          "/api/professors"
        );

        console.log("response: ", response);
        setData(response.data.result || []);
      } catch (error) {
        console.error("Error fetching professors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheses();
  }, []);

  const openEditModal = (thesisIdEdit: string) => {
    const thesis = data.find((thesis) => thesis.id.toString() === thesisIdEdit);

    setSelectedThesis(thesis || null);
    setShowModalEdit(true);
  };

  const openModal = (thesisId: string) => {
    const thesis = data.find((thesis) => thesis.id.toString() === thesisId);

    setSelectedThesis(thesis || null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedThesis) {
      try {
        await axios.put(`/api/thesis/${selectedThesis.id}`);

        setData(data.filter((thesis) => thesis.id !== selectedThesis.id));
        setShowModal(false);
        setSelectedThesis(null);
      } catch (error) {
        console.error("Error deleting thesis:", error);
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
                  <TableCell>{professor.user?.name}</TableCell>
                  <TableCell>{professor.user?.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-4">
                      <Pencil
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() => openEditModal(professor.id.toString())}
                      />
                      <Trash2
                        className="cursor-pointer"
                        color="red"
                        size={18}
                        onClick={() => openModal(professor.id.toString())}
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
        record={selectedThesis!}
      />
      <ProfessorDeleteDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
