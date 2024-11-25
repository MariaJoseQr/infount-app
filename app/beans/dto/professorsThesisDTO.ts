import { ChargeDTO } from "./chargeDTO";
import { ProfessorDTO } from "./professorDTO";

export interface ProfessorThesisDTO {
    id?: number;
    professor?: ProfessorDTO;
    charge?: ChargeDTO;
    thesisId?: number;


    createdAt?: Date;
}