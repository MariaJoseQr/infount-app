// types/ExcelData.ts
export interface ExcelData {
    n: number;
    tituloDeProyecto: string;
    codigoResolucion: string;
    tipo: string;
    fechaActa?: string;
    bachiller1: string;
    bachiller2?: string;
    presidente?: number | string | null;
    secretario?: number | string | null;
    vocal?: number | string | null;
    asesor?: number | string | null;
}