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
    SelectValue 
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";

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

export function RecordAddDialog({
isOpen,
setIsOpen,
}: {
isOpen: boolean;
setIsOpen: (open: boolean) => void;
}) {
const [thesisTypes, setThesisTypes] = useState([]);
const [professors, setProfessors] = useState([]);
const [formData, setFormData] = useState({
thesisTypeId: "",
thesisName: "",
bachelor1: "",
bachelor2: "",
resolutionCode: "",
defenseDate: "",
presidentId: "",
secretaryId: "",
vocalId: "",
advisorId: "",
});
const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [isValid, setIsValid] = useState(false);

useEffect(() => {
    axios.get("/api/thesis-types")
        .then((response) => setThesisTypes(response.data))
        .catch((error) => console.error("Error obteniendo tipos de tesis:", error));
}, []);

useEffect(() => {
    axios.get("/api/professors")
        .then((response) => setProfessors(response.data))
        .catch((error) => console.error("Error obteniendo lista de profesores:", error));
}, []);

useEffect(() => {
    const result = thesisSchema.safeParse(formData);
    setIsValid(result.success);
}, [formData]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
        ...formData, 
        [name]: type === "date" ? new Date(value) : value 
    });
};

const handleSave = async () => {
    // Validar datos del formulario con Zod
    const result = thesisSchema.safeParse(formData);
    if (!result.success) {
        const newErrors = Object.entries(result.error.flatten().fieldErrors).reduce((acc, [key, value]) => {
            acc[key] = { _errors: value };
            return acc;
        }, {});
        setErrors(newErrors);
        return;
    }

    setIsLoading(true);
    try {
        await axios.post("/api/add-thesis-record", formData);
        
        setFormData({
            thesisTypeId: "",
            thesisName: "",
            bachelor1: "",
            bachelor2: "",
            resolutionCode: "",
            defenseDate: "",
            presidentId: "",
            secretaryId: "",
            vocalId: "",
            advisorId: "",
        });
    } catch (error) {
        console.error("Error al guardar el registro:", error);
    } finally {
        setIsLoading(false);
    }
};

return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="sm:max-w-md ">
    <DialogHeader className="sticky top-0 bg-white z-10">
        <DialogTitle 
            className="text-primary"
        >
            Agregar Registro
        </DialogTitle>

        <DialogDescription className="flex flex-col gap-4 max-h-[500px] overflow-y-auto px-4">
            
            {/* Tipo de tesis */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tipo de Tesis</label>
                <Select onValueChange={(value) => setFormData({ ...formData, thesisTypeId: value })}>
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
                {errors?.thesisTypeId && <p className="text-red-500 text-sm">{errors.thesisTypeId._errors[0]}</p>}
            </div>

            {/* Nombre de la tesis */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre de la Tesis</label>
                <Input name="thesisName" value={formData.thesisName} onChange={handleInputChange} />
                {errors?.thesisName && <p className="text-red-500 text-sm">{errors.thesisName._errors[0]}</p>}
            </div>

            {/* Bachiller 1 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Bachiller 1</label>
                <Input name="bachelor1" value={formData.bachelor1} onChange={handleInputChange} />
                {errors?.bachelor1 && <p className="text-red-500 text-sm">{errors.bachelor1._errors[0]}</p>}
            </div>

            {/* Bachiller 2 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Bachiller 2</label>
                <Input name="bachelor2" value={formData.bachelor2} onChange={handleInputChange} />
            </div>

            {/* Código de resolución */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Código de Resolución</label>
                <Input name="resolutionCode" value={formData.resolutionCode} onChange={handleInputChange} />
                {errors?.resolutionCode && <p className="text-red-500 text-sm">{errors.resolutionCode._errors[0]}</p>}
            </div>

            {/* Fecha de sustentación */}
            {formData.thesisTypeId === "ACTA_DE_SUSTENTACION" && (
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de Sustentación</label>
                <Input type="date" name="defenseDate" value={formData.defenseDate} onChange={handleInputChange} />
                {errors?.defenseDate && <p className="text-red-500 text-sm">{errors.defenseDate._errors[0]}</p>}
                </div>
            )}

            {/* Selección de Presidente, Secretario, Vocal, Asesor */}
            {[
                { id: "presidentId", label: "Presidente", placeholder: "Seleccione el presidente" },
                { id: "secretaryId", label: "Secretario", placeholder: "Seleccione el secretario" },
                { id: "vocalId", label: "Vocal", placeholder: "Seleccione el vocal" },
                { id: "advisorId", label: "Asesor", placeholder: "Seleccione el asesor" },
            ].map(({ id, label, placeholder }) => (
                <div key={id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <Select onValueChange={(value) => setFormData({ ...formData, [id]: value })}>
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
                    {errors?.[id] && <p className="text-red-500 text-sm">{errors[id]._errors[0]}</p>}
                </div>
            ))}

        </DialogDescription>
    </DialogHeader>

    <DialogFooter>
        <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
        </Button>
    </DialogFooter>
    </DialogContent>
</Dialog>
);
}
