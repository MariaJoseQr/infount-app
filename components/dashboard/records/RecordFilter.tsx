import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDemoProps {
  onSelect: (value: string) => void; // Define el tipo de `onSelect`
}
export function SelectDemo({ onSelect }: SelectDemoProps) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccione un tipo" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tipo de Investigación</SelectLabel>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="TRABAJO DE GRADUACIÓN">
            Trabajo de Graduación
          </SelectItem>
          <SelectItem value="PROYECTO DE TESIS">Proyecto de Tesis</SelectItem>
          <SelectItem value="SUFICIENCIA PROFESIONAL">
            Suficiencia Profesional
          </SelectItem>
          <SelectItem value="PROYECTO DEL TRABAJO DE GRADUACIÓN">
            Proyecto del Trabajo de Graduación
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
