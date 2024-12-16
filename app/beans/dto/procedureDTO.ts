import { ChargeDTO } from "./chargeDTO";
import { ConstancyDTO } from "./constancyDTO";
import { ProfessorDTO } from "./professorDTO";
import { StateProcedureDTO } from "./statusProcedureDTO";
import { ThesisTypeDTO } from "./thesisTypeDTO";

export interface ProcedureDTO {
    id?: number;
    registerTypes?: ThesisTypeDTO[];
    professor: ProfessorDTO;
    amount?: number;
    startDate?: Date;
    endDate?: Date;
    state?: StateProcedureDTO;
    charges?: ChargeDTO[];
    code?: string;

    constancy?: ConstancyDTO;
}