import { ChargeDTO } from "../dto/chargeDTO";
import { ThesisDTO } from "../dto/thesisDTO";


export interface ThesisConstancyRes extends ThesisDTO {
    charge: ChargeDTO
}
