
import { UserDTO } from "./userDTO";
import { GradeDTO } from "./gradeDTO";

export interface ProfessorDTO {
    id: number;
    code?: string;

    grade?: GradeDTO;
    user?: UserDTO;

    createdAt?: Date;
}