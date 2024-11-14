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
import React, { useState } from 'react';
import {AlertDialogDemo} from './RecordDelete';
import { RecordAddDialog } from "./RecordAddDialog";


const invoices = [
  { invoice: "INV001", resolutionCode: "055-2017-EAPInf", totalAmount: "$250.00", thesisTypeId: "TRABAJO DE GRADUACIÓN" },
  { invoice: "INV002", resolutionCode: "088-2016-EAPInf", totalAmount: "$150.00", thesisTypeId: "PROYECTO DE TESIS" },
  { invoice: "INV003", resolutionCode: "088-2016-EAPInf", totalAmount: "$350.00", thesisTypeId: "TRABAJO DE GRADUACIÓN" },
  { invoice: "INV004", resolutionCode: "088-2016-EAPInf", totalAmount: "$450.00", thesisTypeId: "PROYECTO DE TESIS" },
  { invoice: "INV005", resolutionCode: "088-2016-EAPInf", totalAmount: "$550.00", thesisTypeId: "TRABAJO DE GRADUACIÓN" },
  { invoice: "INV006", resolutionCode: "088-2016-EAPInf", totalAmount: "$200.00", thesisTypeId: "PROYECTO DEL TRABAJO DE GRADUACIÓN" },
];

interface TableDemoProps {
  filter?: string;
}

export interface Invoice {
  invoice?: string;
  resolutionCode: string;
  totalAmount?: string;
  thesisTypeId: string;
  thesisName?: string;
  bachelor1?: string;
  bachelor2?: string;
  defenseDate?: string;
  presidentId?: string;
  secretaryId?: string;
  vocalId?: string;
  advisorId?: string;
}

export function TableDemo({ filter }: TableDemoProps) { //
  const [data, setData] = useState(invoices);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedInvoiced, setSelectedInvoiced] = useState<Invoice | null>(null);

  const openEditModal = (invoiceIdEdit: string) => {
    const invoice = data.find((invoice) => invoice.invoice === invoiceIdEdit);
    setSelectedInvoiced(invoice || null);
    setShowModalEdit(true);
  };


  const openModal = (invoiceId: string) => {
    setSelectedInvoice(invoiceId);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (selectedInvoice) {
      setData(data.filter((invoice) => invoice.invoice !== selectedInvoice));
      setShowModal(false);
      setSelectedInvoice(null);
    }
  };


  const filteredInvoices = filter === "todos" || !filter
    ? data
    : data.filter((invoice) => invoice.thesisTypeId === filter);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Número de Resolución</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredInvoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.resolutionCode}</TableCell>
            <TableCell>{invoice.thesisTypeId}</TableCell>
            <TableCell className="text-right">
            <div className="flex justify-end space-x-4">
              <Pencil 
                color="orange" 
                size={18} 
                style={{ cursor: 'pointer' }}
                onClick={() => openEditModal(invoice.invoice)}
         
              />
              <RecordAddDialog
                  isOpen={showModalEdit}
                  setIsOpen={setShowModalEdit}
                  record={selectedInvoiced} 
                  
                />
              <Trash2
                  color="red"
                  size={18}
                  style={{ cursor: 'pointer'}}
                  onClick={() => openModal(invoice.invoice)} 
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
          <TableCell className="text-right">{filteredInvoices.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
