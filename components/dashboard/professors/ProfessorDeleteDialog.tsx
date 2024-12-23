import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { useState } from "react";
import axios from "axios";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  professor: ProfessorDTO;
  onDelete: (professor: ProfessorDTO) => void;
}

export const ProfessorDeleteDialog: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  setIsOpen,
  professor,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await axios.put(`/api/professors/${professor.id}`);

      onDelete(professor);
    } catch (error) {
      console.error("Error deleting professor:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary font-bold">
            ¿Está seguro de que desea eliminar este docente?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
          <AlertDialogCancel
            className="text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
