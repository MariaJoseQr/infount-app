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
import { ChevronsUpDownIcon } from "lucide-react";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { CustomResponse } from "@/app/beans/customResponse";
import { ProfessorReq } from "@/app/beans/request/professorReq";
import { GradeDTO } from "@/app/beans//dto/gradeDTO";

export function ProfessorAddDialog({
  isOpen,
  setIsOpen,
  professor,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  professor: ProfessorReq | undefined;
}) {
  const [professorGrades, setProfessorGrades] = useState<GradeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      axios
        .get("/api/grades")
        .then((response) => setProfessorGrades(response.data.result))
        .catch((error) => console.error("Error obteniendo los grados:", error));
    }
  }, [isOpen]);

  const formSchema = z.object({
    code: z.string().min(1, "El campo es obligatorio"),
    name: z.string().min(1, "El campo es obligatorio"),
    email: z
      .string()
      .min(1, "El campo es obligatorio")
      .email("Correo inválido"),
    cellphone: z.string().min(1, "El campo es obligatorio"),
    gradeId: z.number({
      required_error: "El campo es obligatorio",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      email: "",
      cellphone: "",
      gradeId: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        code: professor?.code || "",
        name: professor?.name || "",
        email: professor?.email || "",
        cellphone: professor?.cellphone || "",
        gradeId: professor?.gradeId || undefined,
      });
    }
  }, [isOpen, professor, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const professorData = {
      name: data.name.trim(),
      email: data.email.trim(),
      cellphone: data.cellphone.trim(),
      code: data.code.trim(),
      gradeId: data.gradeId,
    };

    console.log("professorData:", professorData);

    try {
      if (!professor) {
        const response = await axios.post("/api/professors", professorData, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Profesor registrado:", response.data);
      } else {
        const response = await axios.put(
          "/api/professors",
          { id: professor.id, ...professorData },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Profesor registrado:", response.data);
      }
    } catch (error) {
      console.error("Error en la solicitud: ", error);
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
            {!professor ? "Nuevo Docente" : "Editar Docente"}
          </DialogTitle>
          <DialogDescription>
            {!professor
              ? "Ingresa los datos del nuevo docente."
              : "Edita los datos del docente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex gap-4 w-full">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="code"
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
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="gradeId"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel className="w-full text-primary">
                          Grado:
                        </FormLabel>
                        <FormControl>
                          <div className="flex-1 text-primary w-full">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal px-3",
                                    field.value
                                      ? "text-gray-600"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? professorGrades.find(
                                        (grade) =>
                                          grade.id === Number(field.value)
                                      )?.name
                                    : "Seleccione el grado"}
                                  <ChevronsUpDownIcon className="ml-auto h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                <DropdownMenuRadioGroup
                                  value={field.value?.toString()}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                >
                                  <ScrollArea className="h-full max-h-32">
                                    {Array.isArray(professorGrades) &&
                                      professorGrades.map((grade) => (
                                        <DropdownMenuRadioItem
                                          key={grade.id}
                                          value={grade.id.toString()}
                                        >
                                          {grade.name}
                                        </DropdownMenuRadioItem>
                                      ))}
                                  </ScrollArea>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <FormField
                control={form.control}
                name="name"
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
                name="email"
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
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="cellphone"
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
                {isLoading
                  ? "Guardando..."
                  : professor
                  ? "Actualizar"
                  : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
