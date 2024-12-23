import { ProfessorThesisDTO } from "./professorsThesisDTO";
import { ThesisTypeDTO } from "./thesisTypeDTO";

export interface ThesisDTO {
    id: number;
    name?: string;
    resolutionCode?: string;
    date?: Date | null;
    firstStudentName?: string;
    secondStudentName?: string;
    type?: ThesisTypeDTO;
    professorsThesis?: ProfessorThesisDTO[];

    createdAt?: Date;
}