import { User } from "@prisma/client";

export interface ProfessorReq {
    id: number;
    code?: string;
    gradeId?: number;
    user?: User;
}