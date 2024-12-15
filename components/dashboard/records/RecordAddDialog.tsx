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

export function RecordAddDialog({
  isOpen,
  setIsOpen,
  record,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  record: ThesisDTO; //any | undefined;
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

  // useEffect(() => {
  //   if (isOpen) {
  //     form.reset({
  //       thesisTypeId: record?.thesisTypeId || "",
  //       thesisName: record?.thesisName || "",
  //       bachelor1: record?.bachelor1 || "",
  //       bachelor2: record?.bachelor2 || "",
  //       resolutionCode: record?.resolutionCode || "",
  //       defenseDate: record?.defenseDate
  //         ? new Date(record.defenseDate)
  //         : undefined,
  //       presidentId: record?.presidentId || "",
  //       secretaryId: record?.secretaryId || "",
  //       vocalId: record?.vocalId || "",
  //       advisorId: record?.advisorId || "",
  //     });
  //   }
  // }, [isOpen, record, form]);

  useEffect(() => {
    if (isOpen) {
      console.log("RECORD RECIBIDO:", record);
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
            {!record ? "Nuevo Registro" : "Editar Registro"}
          </DialogTitle>
          <DialogDescription>
            {!record
              ? "Ingresa los datos del nuevo registro."
              : "Edita los datos del registro."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 mt-2">
              <FormField
                control={form.control}
                name="thesisTypeId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Tipo de Tesis:
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
                                  ? thesisTypes.find(
                                    (type) =>
                                      type.id.toString() === field.value
                                  )?.name // Mostrar el nombre basado en el ID
                                  : "Seleccione el tipo de registro"}
                                <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuRadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <ScrollArea className="h-full max-h-32">
                                  {thesisTypes?.map((type) => (
                                    <DropdownMenuRadioItem
                                      key={type.id}
                                      value={type.id.toString()}
                                    >
                                      {type.name}
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
                name="thesisName"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Nombre de la Tesis:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el nombre de la tesis"
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
                        Bachiller 1:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el nombre del primer bachiller"
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
                        Bachiller 2:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el nombre del segundo bachiller"
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
                        Código de Resolución:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-gray-600"
                          placeholder="Ingrese el código de resolución"
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
                name="defenseDate"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Fecha de Sustentación:
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
              <FormField
                control={form.control}
                name="advisorId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Asesor:
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
                                    (prof) =>
                                      prof.id.toString() === field.value
                                  )?.user?.name
                                  : "Seleccione un docente"}
                                <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuRadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <ScrollArea className="h-full max-h-32">
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
                name="presidentId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Presidente:
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
                                    (prof) =>
                                      prof.id.toString() === field.value
                                  )?.user?.name
                                  : "Seleccione un docente"}
                                <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuRadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <ScrollArea className="h-full max-h-32">
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
                name="secretaryId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Secretario:
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
                                    (prof) =>
                                      prof.id.toString() === field.value
                                  )?.user?.name
                                  : "Seleccione un docente"}
                                <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuRadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <ScrollArea className="h-full max-h-32">
                                  {professors?.map((professor) => (
                                    <DropdownMenuRadioItem
                                      key={professor.id}
                                      value={professor.id.toString()}
                                    >
                                      {professor.user?.name ||
                                        "Nombre no definido"}
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
                name="vocalId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Vocal:
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
                                    (prof) =>
                                      prof.id.toString() === field.value
                                  )?.user?.name
                                  : "Seleccione un docente"}
                                <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuRadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <ScrollArea className="h-full max-h-32">
                                  {professors?.map((professor) => (
                                    <DropdownMenuRadioItem
                                      key={professor.id}
                                      value={professor.id.toString()}
                                    >
                                      {professor.user?.name ||
                                        "Nombre no definido"}
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
