import { ProfessorThesisDTO } from "./professorsThesisDTO";
import { ThesisType } from "./thesisTypeDTO";

export interface ThesisDTO {
    id: number;
    name?: string;
    resolutionCode?: string;
    date?: Date | null;
    firstStudentName?: string;
    secondStudentName?: string;
    type?: ThesisType;
    professorsThesis?: ProfessorThesisDTO[];

    createdAt?: Date;
}