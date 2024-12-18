import { StateProcedureDTO } from "../dto/statusProcedureDTO";


export interface ProcedureReq {
    id: number;
    state: StateProcedureDTO
}
