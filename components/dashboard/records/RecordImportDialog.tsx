import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  // DialogClose,
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
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Por favor, selecciona un archivo con formato .xlsx");
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
  

      setIsOpen(false);
    } catch (error) {
      console.error("Error al importar el archivo:", error);
    } finally {
      setIsLoading(false);
      setFile(null);
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
            </div>
            <div className="flex items-center justify-end">
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
                  <span className="text-sm pr-2">Descargar formato</span>
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <DialogFooter className="sm:justify-start">
           {/* <DialogClose asChild>
            <Button 
              type="submit" 
              className="ml-auto"
              onClick={handleImport}
              disabled={!fileSelected || isLoading}
              >
              {isLoading ? "Importando..." : "Importar"}
            </Button>
          </DialogClose>  */}

          <Button
            onClick={handleImport}
            disabled={!file || isLoading} // Deshabilita si no hay archivo o está cargando
            className="ml-auto"
          >
            {isLoading ? "Importando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
