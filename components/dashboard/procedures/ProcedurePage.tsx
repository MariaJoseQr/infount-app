import { ProcedureTable } from "./ProcedureTable";
import { ProcedureAddDialog } from "./ProcedureAddDialog";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function RecordPage() {
  const [procedureAddDialogOpen, setProcedureAddDialogOpen] = useState(false);
  const [procedures, setProcedures] = useState<ProcedureDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    const fetchProcedures = async () => {
      if (status === "authenticated") {
        setLoading(true);

        try {
          const response = await axios.get("/api/procedures");

          setProcedures(response.data.result || []);
        } catch (error) {
          console.error("Error fetching procedures:", error);
        } finally {
          setLoading(false);
        }
      };
    }
    fetchProcedures();
  }, [status]);

  const handleAddProcedure = (newProcedure: ProcedureDTO) => {
    setProcedures((prevProcedures) => [...prevProcedures, newProcedure]);
  };

  const handleEditProcedure = (updatedProcedure: ProcedureDTO) => {
    setProcedures((prevProcedures) =>
      prevProcedures.map((procedure) =>
        procedure.id === updatedProcedure.id ? updatedProcedure : procedure
      )
    );
  };

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
        onAddProcedure={handleAddProcedure}
      />

      <div className="pt-4">
        <ProcedureTable
          procedures={procedures}
          loading={loading}
          onEditProcedure={handleEditProcedure}
        />
      </div>
    </>
  );
}
