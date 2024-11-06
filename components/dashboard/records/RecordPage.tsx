import { TableDemo } from "./RecordTable";
import { RecordImportDialog } from "./RecordImportDialog";
import { RecordAddDialog } from "./RecordAddDialog";
import { Button } from "@/components/ui/button";
import { Import, Plus } from "lucide-react";
import { useState } from "react";

export default function RecordPage() {
  const [recordImportDialogOpen, setRecordImportDialogOpen] = useState(false);
  const [recordAddDialogOpen, setRecordAddDialogOpen] = useState(false);

  return (
    <>
      <div className="grid">
        <h1 className="text-4xl text-primary">Registros</h1>
        <p className="mt-2">
          Gestiona la información de los trabajos de investigación.
        </p>
      </div>
      <div className="flex ml-auto space-x-2">
        <Button
          className="text-white items-center"
          onClick={() => setRecordAddDialogOpen(true)}
        >
          <Plus className="w-32 h-32" />
          <span className="text-base">Agregar Registro</span>
        </Button>
        <Button
          className="text-primary items-center border-primary"
          variant={"outline"}
          onClick={() => setRecordImportDialogOpen(true)}
        >
          <Import className="w-10 h-10" />
          <span className="text-base">Importar</span>
        </Button>
      </div>
      <div className="pt-4">
        <TableDemo />
      </div>
      <RecordAddDialog
        isOpen={recordAddDialogOpen}
        setIsOpen={setRecordAddDialogOpen}
      />
      <RecordImportDialog
        isOpen={recordImportDialogOpen}
        setIsOpen={setRecordImportDialogOpen}
      />
    </>
  );
}
