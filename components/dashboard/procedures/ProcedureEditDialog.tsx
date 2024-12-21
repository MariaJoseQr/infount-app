import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";

interface StateDTO {
  id: number;
  name: string;
}

export function ProcedureEditDialog({
  isOpen,
  setIsOpen,
  procedure,
  onEditProcedure,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  procedure: ProcedureDTO | undefined;
  onEditProcedure: (procedure: ProcedureDTO) => void;
}) {
  const [states, setStates] = useState<StateDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/states")
      .then((response) => {
        setStates(response.data.result || []);
      })
      .catch((error) =>
        console.error("Error obteniendo lista de estados:", error)
      );
  }, []);

  const formSchema = z.object({
    stateId: z.number({
      required_error: "El campo es obligatorio",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stateId: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        stateId: procedure?.state?.id || undefined,
      });
    }
  }, [isOpen, procedure, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const stateData = {
      id: procedure!.id,
      state: { id: data.stateId },
    };

    try {
      const response = await axios.put("/api/procedures", stateData);

      onEditProcedure(response.data.result);
    } catch (error) {
      console.error("Error al editar el trámite:", error);
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
          <DialogTitle className="text-primary">Editar Trámite</DialogTitle>
          <DialogDescription>Edita el estado del trámite.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 mt-4">
              <FormField
                control={form.control}
                name="stateId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="w-full text-primary">
                        Estado:
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
                                  ? states?.find(
                                      (state: StateDTO) =>
                                        state.id === Number(field.value)
                                    )?.name
                                  : "Seleccione un estado"}
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
                                  {states?.map((state) => (
                                    <DropdownMenuRadioItem
                                      key={state.id}
                                      value={state.id.toString()}
                                    >
                                      {state.name}
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
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
