import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AlertDialogDemo } from './RecordDelete';
import { RecordAddDialog } from "./RecordAddDialog";
import axios from "axios";

/*
const invoices = [
  { invoice: "INV001", resolutionCode: "055-2017-EAPInf", totalAmount: "$250.00", thesisTypeId: "TRABAJO DE GRADUACIÓN" },
  { invoice: "INV002", resolutionCode: "088-2016-EAPInf", totalAmount: "$150.00", thesisTypeId: "PROYECTO DE TESIS" },
  { invoice: "INV003", resolutionCode: "088-2016-EAPInf", totalAmount: "$350.00", thesisTypeId: "TRABAJO DE GRADUACIÓN" },
  { invoice: "INV004", resolutionCode: "088-2016-EAPInf", totalAmount: "$450.00", thesisTypeId: "PROYECTO DE TESIS" },
  { invoice: "INV005", resolutionCode: "088-2016-EAPInf", totalAmount: "$550.00", thesisTypeId: "TRABAJO DE GRADUACIÓN" },
  { invoice: "INV006", resolutionCode: "088-2016-EAPInf", totalAmount: "$200.00", thesisTypeId: "PROYECTO DEL TRABAJO DE GRADUACIÓN" },
];
*/

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
  professorsThesis: { professor: { user: { name: string } }, charge: { name: string } }[]
  // presidentId?: string;
  // secretaryId?: string;
  // vocalId?: string;
  // advisorId?: string;
}

export function TableDemo({ filter }: TableDemoProps) {
  const [data, setData] = useState<Thesis[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const response = await axios.get('/api/thesis');
        console.log("DATA RESPONSE: ", response.data.data)
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching theses:', error);
      }
    };
    fetchTheses();
  }, []);

  const openEditModal = (thesisIdEdit: string) => {
    const thesis = data.find((thesis) => thesis.id.toString() === thesisIdEdit);
    console.log("Thesis to send: ", thesis)
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
      // setData(data.filter((thesis) => thesis.name !== selectedThesis.name));
      // setShowModal(false);
      // setSelectedThesis(null);
      try {
        await axios.put(`/api/thesis/${selectedThesis.id}`);

        setData(data.filter((thesis) => thesis.id !== selectedThesis.id));
        setShowModal(false);
        setSelectedThesis(null);
      } catch (error) {
        console.error('Error deleting thesis:', error);
      }
    }
  };

  const filteredTheses = filter === "todos" || !filter
    ? data
    : data.filter((thesis) => thesis.type.name === filter);

  return (
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
        {filteredTheses.map((thesis) => (
          <TableRow key={thesis.name}>
            <TableCell>{thesis.resolutionCode}</TableCell>
            <TableCell>{thesis.name}</TableCell>
            <TableCell>{thesis.type.name}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-4">
                <Pencil
                  color="orange"
                  size={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openEditModal(thesis.id.toString())}
                />
                <RecordAddDialog
                  isOpen={showModalEdit}
                  setIsOpen={setShowModalEdit}
                  record={selectedThesis}
                />
                <Trash2
                  color="red"
                  size={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openModal(thesis.id.toString())}
                />
                <AlertDialogDemo
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  onConfirm={handleDelete}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-right">
            Total de registros
          </TableCell>
          <TableCell className="text-right">{filteredTheses.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
