import { SchoolDTO } from "./schoolDTO";

export interface UserDTO {
    id?: number;
    username?: string;
    name?: string;
    email?: string;
    cellphone?: string;

    // FK hacía School
    school?: SchoolDTO;

    createdAt?: Date;
}