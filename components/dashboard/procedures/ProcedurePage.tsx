import { ProcedureTable } from "./ProcedureTable";
import { ProcedureAddDialog } from "./ProcedureAddDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function RecordPage() {
  const [procedureAddDialogOpen, setProcedureAddDialogOpen] = useState(false);

  return (
    <>
      <div className="grid">
        <h1 className="text-4xl text-primary">Trámites</h1>
        <p className="mt-2">
          Gestiona los trámites de generación de constancias de asesorías.
        </p>
      </div>
      <div className="flex ml-auto space-x-2">
        <Button
          className="text-white items-center"
          onClick={() => setProcedureAddDialogOpen(true)}
        >
          <Plus className="w-32 h-32" />
          <span className="text-base">Agregar Trámite</span>
        </Button>
      </div>

      <ProcedureAddDialog
        isOpen={procedureAddDialogOpen}
        setIsOpen={setProcedureAddDialogOpen}
        procedure={undefined}
      />

      <div className="pt-4">
        <ProcedureTable />
      </div>
    </>
  );
}
