//import { RecordTable } from "./RecordTable";
//import { RecordAddDialog } from "./RecordAddDialog";
import { Button } from "@/components/ui/button";
import { Import, Plus } from "lucide-react";
import { useState } from "react";

export default function RecordPage() {
  const [selectedType, setSelectedType] = useState("");
  const [recordAddDialogOpen, setRecordAddDialogOpen] = useState(false);
  const [recordSelected, setRecordSelected] = useState<any | undefined>();

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
          onClick={() => setRecordAddDialogOpen(true)}
        >
          <Plus className="w-32 h-32" />
          <span className="text-base">Agregar Trámite</span>
        </Button>
      </div>

      <div className="pt-4">
        <p className="mt-2 font-bold">Filtros:</p>
        <div className="mt-2 flex items-center space-x-2">
          <p>Tipo de Investigación:</p>
          {/*<SelectDemo onSelect={setSelectedType} />*/}
        </div>
      </div>
      {/*
      <div className="pt-4">
        <RecordTable filter={selectedType} />
      </div>
      
      <RecordAddDialog
        isOpen={recordAddDialogOpen}
        setIsOpen={setRecordAddDialogOpen}
        record={recordSelected}
      />
     
      <RecordImportDialog
        isOpen={recordImportDialogOpen}
        setIsOpen={setRecordImportDialogOpen}
      />
      */}
    </>
  );
}
