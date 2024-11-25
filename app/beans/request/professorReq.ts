
import { UserReq } from "./userReq";

export interface ProfessorReq {
    id: number;
    code: string;
    gradeId: number;
    user: UserReq;
}