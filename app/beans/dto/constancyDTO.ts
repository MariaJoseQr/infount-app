import { ThesisDTO } from "./thesisDTO";


export interface ConstancyDTO {
    id?: number;
    registrationNumber?: string;
    fileNumber?: string;

    thesis?: ThesisDTO[];
}