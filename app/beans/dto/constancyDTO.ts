import { ThesisConstancyRes } from "../response/constancyThesisRes";


export interface ConstancyDTO {
    id?: number;
    registrationNumber?: string;
    fileNumber?: string;

    thesis?: ThesisConstancyRes[];
}