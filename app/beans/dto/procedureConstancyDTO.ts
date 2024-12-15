import { ChargeDTO } from "./chargeDTO";
import { ProfessorDTO } from "./professorDTO";
import { StateProcedureDTO } from "./statusProcedureDTO";
import { ThesisTypeDTO } from "./thesisTypeDTO";

export interface ProcedureDTO {
    id?: number;
    registerTypes: ThesisTypeDTO[]; //old: thesisType
    professorDTO: ProfessorDTO;
    amount?: number;
    startDate?: Date;
    endDate?: Date; //new
    state?: StateProcedureDTO;
    charges?: ChargeDTO[]; //new
    code?: string; //new
}