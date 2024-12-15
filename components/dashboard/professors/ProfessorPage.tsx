import { ProfessorTable } from "./ProfessorTable";
import { ProfessorAddDialog } from "./ProfessorAddDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ProfessorPage() {
  const [professorAddDialogOpen, setProfessorAddDialogOpen] = useState(false);
  const [professorSelected, setProfessorSelected] = useState<any | undefined>();

  return (
    <>
      <div className="grid">
        <h1 className="text-4xl text-primary">Docentes</h1>
        <p className="mt-2">Gestiona la información de los docentes.</p>
      </div>
      <div className="flex ml-auto space-x-2">
        <Button
          className="text-white items-center"
          onClick={() => setProfessorAddDialogOpen(true)}
        >
          <Plus className="w-32 h-32" />
          <span className="text-base">Agregar Docente</span>
        </Button>
      </div>

      <div className="pt-4">
        <ProfessorTable />
      </div>

      <ProfessorAddDialog
        isOpen={professorAddDialogOpen}
        setIsOpen={setProfessorAddDialogOpen}
        professor={professorSelected}
      />
    </>
  );
}
