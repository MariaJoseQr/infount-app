import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

export function RecordImportDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setFileSelected(file);
        setError("");
      } else {
        setFileSelected(null);
        setError("Por favor, seleccione un archivo .xlsx válido.");
      }
    } else {
      setFileSelected(null);
    }
  };

  const handleImport = () => {
    if (fileSelected) {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          setIsOpen(false);
        }, 2000);
      }
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Importación de registros
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center">
              Importa registros de forma masiva descargando el siguiente Excel:
              <Button
                
                size="sm"
                className="px-3 items-center border-primary text-primary"
                variant="outline"
              >
                <a
                    href="/Formato.xlsx" // RUTA del formato - en la carpeta public 
                    download
                    className="flex items-center text-sm"
                  >
                    <span className="text-sm">Descargar formato</span>
                    <Download className="h-4 w-4" />
                  </a>
                
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full items-center text-gray-500">
          <Input
            id="picture"
            type="file"
            accept=".xlsx"  // formato de archivo 
            className="text-zinc-600 file:text-gray-800 cursor-pointer"
            onChange={handleFileChange}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button 
              type="submit" 
              className="ml-auto"
              onClick={handleImport}
              disabled={!fileSelected || isLoading}
              >
              {isLoading ? "Importando..." : "Importar"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
