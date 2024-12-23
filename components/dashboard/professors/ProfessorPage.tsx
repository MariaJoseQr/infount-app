import { ProfessorTable } from "./ProfessorTable";
import { ProfessorAddDialog } from "./ProfessorAddDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { useSession } from "next-auth/react";

export default function ProfessorPage() {
  const [professorAddDialogOpen, setProfessorAddDialogOpen] = useState(false);
  const [professors, setProfessors] = useState<ProfessorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      if (status === "authenticated") {
        console.log("TRAE PROFESOREEEEEEEEEEES: ", status);
        try {
          const response = await axios.get("/api/professors");

          setProfessors(response.data.result || []);
        } catch (error) {
          console.error("Error fetching professors:", error);
        } finally {
          setLoading(false);
        }
      }

    };
    fetchProfessors();
  }, [status]);

  const handleProfessor = (professor: ProfessorDTO) => {
    setProfessors((prevProfessors) => {
      const exists = prevProfessors.some((p) => p.id === professor.id);

      if (exists) {
        return prevProfessors.map((p) =>
          p.id === professor.id ? professor : p
        );
      } else {
        return [professor, ...prevProfessors];
      }
    });
  };

  const onDelete = (professor: ProfessorDTO) => {
    setProfessors((prevProfessors) =>
      prevProfessors.filter((p) => p.id !== professor.id)
    );
  };

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
        <ProfessorTable
          professors={professors}
          loading={loading}
          onHandleProfessor={handleProfessor}
          onDelete={onDelete}
        />
      </div>

      <ProfessorAddDialog
        isOpen={professorAddDialogOpen}
        setIsOpen={setProfessorAddDialogOpen}
        professor={undefined}
        onHandleProfessor={handleProfessor}
      />
    </>
  );
}
