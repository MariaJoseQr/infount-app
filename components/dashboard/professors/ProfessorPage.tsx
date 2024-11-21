import { Button } from "@/components/ui/button";
import { Import, Plus } from "lucide-react";

export default function ProfessorPage() {
  return (
    <>
      <div className="grid">
        <h1 className="text-4xl text-primary">Docentes</h1>
        <p className="mt-2">Gestiona la información de los docentes.</p>
      </div>
      <div className="flex ml-auto space-x-2">
        <Button className="text-white items-center">
          <Plus className="w-32 h-32" />
          <span className="text-base">Agregar Docente</span>
        </Button>
      </div>
      <div className="pt-4">{/*TODO: PROFESSORS TABLE*/}</div>
    </>
  );
}
