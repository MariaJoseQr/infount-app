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
  DropdownMenuCheckboxItem,
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
import { CalendarIcon, ChevronsUpDownIcon } from "lucide-react";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ThesisTypeDTO } from "@/app/beans/dto/thesisTypeDTO";
import { ChargeDTO } from "@/app/beans/dto/chargeDTO";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";

export function ProcedureAddDialog({
  isOpen,
  setIsOpen,
  procedure,
  onAddProcedure,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  procedure: ProcedureDTO | undefined;
  onAddProcedure: (newProcedure: ProcedureDTO) => void;
}) {
  const [professors, setProfessors] = useState<ProfessorDTO[]>([]);
  const [thesisTypes, setThesisTypes] = useState<ThesisTypeDTO[]>([]);
  const [charges, setCharges] = useState<ChargeDTO[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/charges")
      .then((response) => setCharges(response.data.result || []))
      .catch((error) => console.error("Error obteniendo los cargos:", error));
  }, []);

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
      .get("/api/professors")
      .then((response) => {
        setProfessors(response.data.result || []);
      })
      .catch((error) =>
        console.error("Error obteniendo lista de profesores:", error)
      );
  }, []);

  const formSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    professorId: z.number({
      required_error: "El campo es obligatorio",
    }),
    chargesIds: z.string().array(),
    registerTypesIds: z.string().array(),
    amount: z.number({
      required_error: "El campo es obligatorio",
    }),
    fileNumber: z.string().min(1, "El campo es obligatorio"),
    registrationNumber: z.string().min(1, "El campo es obligatorio"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      professorId: undefined,
      chargesIds: [],
      registerTypesIds: [],
      amount: undefined,
      fileNumber: "",
      registrationNumber: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        startDate: procedure?.startDate
          ? new Date(procedure.startDate)
          : new Date("2024-01-01T05:00:00"),
        endDate: procedure?.endDate ? new Date(procedure.endDate) : new Date(),
        professorId: procedure?.professor?.id || undefined,
        chargesIds: procedure?.charges
          ? procedure.charges.map((charge) => charge.id.toString())
          : [],
        registerTypesIds: procedure?.registerTypes
          ? procedure.registerTypes.map((type) => type.id.toString())
          : [],
        amount: procedure?.amount || undefined,
        fileNumber: procedure?.constancy?.fileNumber || "",
        registrationNumber: procedure?.constancy?.registrationNumber || "",
      });
    }
  }, [isOpen, procedure, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const procedureData = {
      startDate: data.startDate,
      endDate: data.endDate,
      professor: { id: data.professorId },
      charges:
        data.chargesIds.length > 0
          ? data.chargesIds.map((id: string) => ({ id: Number(id) }))
          : null,
      registerTypes:
        data.registerTypesIds.length > 0
          ? data.registerTypesIds.map((id: string) => ({ id: Number(id) }))
          : null,
      amount: data.amount,
      constancy: {
        fileNumber: data.fileNumber,
        registrationNumber: data.registrationNumber,
      },
    };

    try {
      const response = await axios.post("/api/procedures", procedureData);

      onAddProcedure(response.data.result);
    } catch (error) {
      console.error("Error al guardar el trámite:", error);
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
            {!procedure ? "Nuevo Trámite" : "Editar Trámite"}
          </DialogTitle>
          <DialogDescription>
            {!procedure
              ? "Ingresa los datos del nuevo trámite."
              : "Edita los datos del trámite."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex gap-4 w-full">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel className="w-full text-primary">
                          Fecha de inicio:
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  field.value
                                    ? "text-gray-600"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="h-4 w-4" />
                                {field.value ? (
                                  field.value.toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                ) : (
                                  <span>Seleccione la fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                  name="endDate"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel className="w-full text-primary">
                          Fecha de fin:
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  field.value
                                    ? "text-gray-600"
                                    : "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="h-4 w-4" />
                                {field.value ? (
                                  field.value.toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                ) : (
                                  <span>Seleccione la fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <FormField
                control={form.control}
                name="professorId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Docente:
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
                                  ? professors.find(
                                      (prof: ProfessorDTO) =>
                                        prof.id === Number(field.value)
                                    )?.user?.name
                                  : "Seleccione un docente"}
                                <ChevronsUpDownIcon className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuRadioGroup
                                value={String(field.value)}
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                              >
                                <ScrollArea className="h-32">
                                  {professors?.map((professor) => (
                                    <DropdownMenuRadioItem
                                      key={professor.id}
                                      value={professor.id.toString()}
                                    >
                                      {professor.user!.name}
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
              <FormField
                control={form.control}
                name="chargesIds"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Cargo del docente:
                      </FormLabel>
                      <FormControl>
                        <div className="flex-1 text-primary">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal px-3 h-auto w-full text-wrap",
                                  field.value === null ||
                                    field.value.length === 0
                                    ? "text-muted-foreground"
                                    : "text-gray-600"
                                )}
                              >
                                {!field.value?.length
                                  ? "Todos"
                                  : charges
                                      .filter((charge) =>
                                        field.value.includes(
                                          charge.id.toString()
                                        )
                                      )
                                      .map((charge) => charge.name)
                                      .join(", ")}
                                <ChevronsUpDownIcon className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-xs p-2">
                              <DropdownMenuRadioGroup>
                                <ScrollArea className="h-32">
                                  <DropdownMenuCheckboxItem
                                    key="todos"
                                    checked={!field.value?.length}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked ? null : [];
                                      field.onChange(updatedValue);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    Todos
                                  </DropdownMenuCheckboxItem>

                                  {charges?.map((charge) => (
                                    <DropdownMenuCheckboxItem
                                      key={charge.id}
                                      checked={field.value?.includes(
                                        charge.id.toString()
                                      )}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [
                                              ...field.value,
                                              charge.id.toString(),
                                            ]
                                          : field.value.filter(
                                              (val) =>
                                                val !== charge.id.toString()
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {charge.name}
                                    </DropdownMenuCheckboxItem>
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
              <FormField
                control={form.control}
                name="registerTypesIds"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Tipo de registro:
                      </FormLabel>
                      <FormControl>
                        <div className="flex-1 text-primary">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal px-3 h-auto w-full text-wrap",
                                  field.value === null ||
                                    field.value.length === 0
                                    ? "text-muted-foreground"
                                    : "text-gray-600"
                                )}
                              >
                                {!field.value?.length
                                  ? "Todos"
                                  : thesisTypes
                                      .filter((type) =>
                                        field.value.includes(type.id.toString())
                                      )
                                      .map((type) => type.name)
                                      .join(", ")}
                                <ChevronsUpDownIcon className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-xs p-2">
                              <DropdownMenuRadioGroup>
                                <ScrollArea className="h-48">
                                  <DropdownMenuCheckboxItem
                                    key="todos"
                                    checked={!field.value?.length}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked ? null : [];
                                      field.onChange(updatedValue);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    Todos
                                  </DropdownMenuCheckboxItem>

                                  {thesisTypes?.map((type) => (
                                    <DropdownMenuCheckboxItem
                                      key={type.id}
                                      checked={field.value?.includes(
                                        type.id.toString()
                                      )}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, type.id.toString()]
                                          : field.value.filter(
                                              (val) =>
                                                val !== type.id.toString()
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {type.name}
                                    </DropdownMenuCheckboxItem>
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
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Cantidad de registros:
                      </FormLabel>
                      <FormControl>
                        <div className="relative w-full py-1">
                          <Input
                            className="w-full text-gray-600"
                            placeholder="Ingrese la cantidad"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }}
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                            registros
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <span className="text-gray-500 text-sm">
                Ingresa los datos de seguimiento:
              </span>
              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="fileNumber"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel className="w-full text-primary">
                            N° de expediente:
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-full text-gray-600"
                              placeholder="Ingrese n° de expediente"
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
                    name="registrationNumber"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel className="w-full text-primary">
                            N° de registro:
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-full text-gray-600"
                              placeholder="Ingrese n° de registro"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Guardando..."
                  : procedure
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
