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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    /* Form,  */
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl, 
    FormMessage 
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Validaciones con Zod
const thesisSchema = z.object({
    thesisTypeId: z.string().nonempty("El campo es obligatorio"),
    thesisName: z.string().nonempty("El campo es obligatorio"),
    bachelor1: z.string().nonempty("El campo es obligatorio"),
    bachelor2: z.string().optional(),
    resolutionCode: z.string().nonempty("El campo es obligatorio"),
    defenseDate: z.string().optional(),
    presidentId: z.string().nonempty("El campo es obligatorio"),
    secretaryId: z.string().nonempty("El campo es obligatorio"),
    vocalId: z.string().nonempty("El campo es obligatorio"),
    advisorId: z.string().nonempty("El campo es obligatorio"),
});

type FormDataType = z.infer<typeof thesisSchema>;

export function RecordAddDialog({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) {
    const [thesisTypes, setThesisTypes] = useState<Array<{ id: string; name: string }>>([]);
    const [professors, setProfessors] = useState<Array<{ id: string; name: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<FormDataType>({
        resolver: zodResolver(thesisSchema),
    });
    const { handleSubmit, reset, formState: { errors } } = methods;

    useEffect(() => {
        axios
            .get("/api/thesis-types")
            .then((response) => setThesisTypes(response.data))
            .catch((error) => console.error("Error obteniendo tipos de tesis:", error));
    }, []);

    useEffect(() => {
        axios
            .get("/api/professors")
            .then((response) => setProfessors(response.data))
            .catch((error) => console.error("Error obteniendo lista de profesores:", error));
    }, []);

    const onSubmit = async (data: FormDataType) => {
        setIsLoading(true);
        try {
            await axios.post("/api/add-thesis-record", data);
            reset();
        } catch (error) {
            console.error("Error al guardar el registro:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-primary">Agregar Registro</DialogTitle>
                </DialogHeader>
                <DialogDescription className="flex flex-col gap-4 max-h-[500px] overflow-y-auto px-4">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Tipo de Tesis */}
                            <FormField
                                name="thesisTypeId"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Tipo de Tesis</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el tipo de tesis" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {thesisTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage>{errors?.thesisTypeId?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Nombre de la Tesis */}
                            <FormField 
                                name="thesisName"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Nombre de la Tesis</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage>{errors?.thesisName?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Bachiller 1 */}
                            <FormField
                                name="bachelor1"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Bachiller 1</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage>{errors?.bachelor1?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Bachiller 2 */}
                            <FormField
                                name="bachelor2"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Bachiller 2</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Código de Resolución */}
                            <FormField
                                name="resolutionCode"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Código de Resolución</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage>{errors?.resolutionCode?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Fecha de Sustentación */}
                            <FormField
                                    name="defenseDate"
                                    render={({ field }) => (
                                        <FormItem className="mt-4">
                                            <FormLabel>Fecha de Sustentación</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="date-input-right" />
                                            </FormControl>
                                            <FormMessage>{errors?.defenseDate?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />


                            {/* Selección de Presidente, Secretario, Vocal, Asesor */}
                            {([
                                    { id: "presidentId", label: "Presidente", placeholder: "Seleccione el presidente" },
                                    { id: "secretaryId", label: "Secretario", placeholder: "Seleccione el secretario" },
                                    { id: "vocalId", label: "Vocal", placeholder: "Seleccione el vocal" },
                                    { id: "advisorId", label: "Asesor", placeholder: "Seleccione el asesor" },
                                ] as { id: keyof FormDataType; label: string; placeholder: string }[]).map(({ id, label, placeholder }) => (
                                    <FormField
                                        key={id}
                                        name={id}
                                        render={({ field }) => (
                                            <FormItem className="mt-4">
                                                <FormLabel>{label}</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={placeholder} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {professors.map((prof) => (
                                                                <SelectItem key={prof.id} value={prof.id}>
                                                                    {prof.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage>{errors?.[id]?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                ))}

                            <DialogFooter className="mt-4">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Guardando..." : "Guardar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}
