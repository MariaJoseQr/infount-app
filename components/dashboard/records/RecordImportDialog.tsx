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
                <span className="text-sm">Descargar formato</span>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full items-center text-gray-500">
          <Input
            id="picture"
            type="file"
            className="text-zinc-600 file:text-gray-800 cursor-pointer"
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="submit" className="ml-auto">
              Importar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
