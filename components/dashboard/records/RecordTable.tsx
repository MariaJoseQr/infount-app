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
import { RecordDeleteDialog } from "./RecordDeleteDialog";
import { RecordAddDialog } from "./RecordAddDialog";
import axios from "axios";
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";
import { CustomResponse } from "@/app/beans/customResponse";
import BarLoader from "react-spinners/BarLoader";

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

export function RecordTable({ filter }: TableDemoProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ThesisDTO[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<ThesisDTO | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const openEditModal = (thesisIdEdit: string) => {
    const thesis = data.find((thesis) => thesis.id.toString() === thesisIdEdit);

    setSelectedThesis(thesis || null);
    setShowEditModal(true);
  };

  const openDeleteModal = (thesisId: string) => {
    const thesis = data.find((thesis) => thesis.id.toString() === thesisId);

    setSelectedThesis(thesis || null);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedThesis) {
      try {
        await axios.put(`/api/thesis/${selectedThesis.id}`);

        setData(data.filter((thesis) => thesis.id !== selectedThesis.id));
        setShowDeleteModal(false);
        setSelectedThesis(null);
      } catch (error) {
        console.error("Error deleting thesis:", error);
      }
    }
  };

  const filteredTheses =
    filter === "todos" || !filter
      ? data
      : data.filter((thesis) => thesis.type?.name === filter);

  return (
    <>
      <div className="max-h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Resolución</TableHead>
              <TableHead>Nombre de la Tesis</TableHead>
              <TableHead>Tipo</TableHead>
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
              filteredTheses.map((thesis) => (
                <TableRow key={thesis.name}>
                  <TableCell>{thesis.resolutionCode}</TableCell>
                  <TableCell>{thesis.name}</TableCell>
                  <TableCell>{thesis.type?.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-4">
                      <Pencil
                        className="cursor-pointer text-primary"
                        size={18}
                        onClick={() => openEditModal(thesis.id.toString())}
                      />
                      <Trash2
                        className="cursor-pointer"
                        color="red"
                        size={18}
                        onClick={() => openDeleteModal(thesis.id.toString())}
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
                {filteredTheses.length}
              </TableCell>
            </TableRow>
          </TableFooter>
          */}
        </Table>
      </div>

      <RecordAddDialog
        isOpen={showEditModal}
        setIsOpen={setShowEditModal}
        record={selectedThesis!}
      />
      <RecordDeleteDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
