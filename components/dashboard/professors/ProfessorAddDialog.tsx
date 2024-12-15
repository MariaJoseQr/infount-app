import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";

export function ProfessorAddDialog({
  isOpen,
  setIsOpen,
  record,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  record: ThesisDTO;
}) {
  const [thesisTypes, setThesisTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [professors, setProfessors] = useState<ProfessorDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/thesis-type")
      .then((response) => setThesisTypes(response.data))
      .catch((error) =>
        console.error("Error obteniendo tipos de tesis:", error)
      );
  }, []);

  useEffect(() => {
    axios
      .get<CustomResponse<ProfessorDTO[]>>("/api/professors")
      .then((response) => {
        console.log("RESULT:", response.data.result);
        setProfessors(response.data.result || []);
      })
      .catch((error) =>
        console.error("Error obteniendo lista de profesores:", error)
      );
  }, []);

  const formSchema = z.object({
    id: z.number().optional(),
    thesisTypeId: z.string().min(1, "El campo es obligatorio"),
    thesisName: z.string().min(1, "El campo es obligatorio"),
    bachelor1: z.string().min(1, "El campo es obligatorio"),
    bachelor2: z.string().optional(),
    resolutionCode: z.string().min(1, "El campo es obligatorio"),
    defenseDate: z.date().optional(),
    presidentId: z.string().min(1, "El campo es obligatorio"),
    secretaryId: z.string().min(1, "El campo es obligatorio"),
    vocalId: z.string().min(1, "El campo es obligatorio"),
    advisorId: z.string().min(1, "El campo es obligatorio"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      thesisTypeId: "",
      thesisName: "",
      bachelor1: "",
      bachelor2: "",
      resolutionCode: "",
      defenseDate: undefined,
      presidentId: "",
      secretaryId: "",
      vocalId: "",
      advisorId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: record?.id || 0,
        thesisTypeId: record?.type?.id.toString() || "",
        thesisName: record?.name || "",
        bachelor1: record?.firstStudentName || "",
        bachelor2: record?.secondStudentName || "",
        resolutionCode: record?.resolutionCode || "",
        defenseDate: record?.date ? new Date(record.date) : undefined,
        presidentId:
          record?.professorsThesis
            ?.find((p) => p.charge?.name === "Presidente")
            ?.professor?.id?.toString() || "",
        secretaryId:
          record?.professorsThesis
            ?.find((p) => p.charge?.name === "Secretario")
            ?.professor?.id?.toString() || "",
        vocalId:
          record?.professorsThesis
            ?.find((p) => p.charge?.name === "Vocal")
            ?.professor?.id?.toString() || "",
        advisorId:
          record?.professorsThesis
            ?.find((p) => p.charge?.name === "Asesor")
            ?.professor?.id?.toString() || "",
      });
    }
  }, [isOpen, record, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const recordData: ThesisDTO = {
      id: data.id ? Number(data.id) : 0,
      type: { id: Number(data.thesisTypeId) },
      name: data.thesisName.trim(),
      firstStudentName: data.bachelor1.trim(),
      secondStudentName: data.bachelor2?.trim(),
      resolutionCode: data.resolutionCode.trim(),
      date: data.defenseDate ? new Date(data.defenseDate) : null,
      professorsThesis: [
        { charge: { id: 1 }, professor: { id: Number(data.presidentId) } },
        { charge: { id: 2 }, professor: { id: Number(data.secretaryId) } },
        { charge: { id: 3 }, professor: { id: Number(data.vocalId) } },
        { charge: { id: 4 }, professor: { id: Number(data.advisorId) } },
      ],
    };
    console.log("recordData: ", recordData);

    try {
      if (!record) {
        axios
          .post<CustomResponse<number>>("/api/thesis", recordData)
          .then((response) => {
            if (response.data.resultType == ResultType.OK)
              //TODO: Notificacion que comunique la accion se registro correctamente (se puede usar el data.message)
              console.log("REGISTRO CORRECTAMENTE");
            else {
              //TODO: Notificacion que comunique la accion se registro correctamente (se puede usar el data.message)
              console.log("ERROR/ADVERTENCIA AL REGISTRAR");
            }
          })
          .catch((error) =>
            console.error("Error obteniendo al insertar tesis:", error)
          );
      } else {
        axios
          .put("/api/thesis", recordData)
          .then((response) => {
            if (response.data.resultType == ResultType.OK)
              //TODO: Notificacion que comunique la accion se registro correctamente (se puede usar el data.message)
              console.log("ACTUALIZACION EXITOSA");
            else {
              //TODO: Notificacion que comunique hubo un inconveniente (se puede usar el data.message)
              console.log("ERROR/ADVERTENCIA AL ACTUALIZAR");
            }
          })
          .catch((error) =>
            console.error("Error obteniendo al actualizar tesis:", error)
          );
      }
    } catch (error) {
      console.error("Error submitting record:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-md max-h-[85vh] overflow-y-auto"
        style={{ clipPath: "inset(0 round 0.45rem)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-primary">
            {!record ? "Nuevo Docente" : "Editar Docente"}
          </DialogTitle>
          <DialogDescription>
            {!record
              ? "Ingresa los datos del nuevo docente."
              : "Edita los datos del docente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 mt-2">
              <FormField
                control={form.control}
                name="thesisName"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Código:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el código del docente"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="bachelor1"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Nombre:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el nombre del docente"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="bachelor2"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Correo electrónico:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el correo electrónico del docente"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="resolutionCode"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Teléfono:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el teléfono del docente"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : record ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
