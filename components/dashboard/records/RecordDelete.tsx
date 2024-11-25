import React from 'react';
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

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AlertDialogDemo: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black font-bold">Confirmación de Eliminación</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Eliminar
          </AlertDialogAction>
          <AlertDialogCancel className="text-black" onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
