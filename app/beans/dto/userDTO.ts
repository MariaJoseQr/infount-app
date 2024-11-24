import { SchoolDTO } from "./schoolDTO";

export interface UserDTO {
    id: number;
    username?: string;
    name?: string;
    email?: string;
    celphone?: string;

    // FK hacía School
    school?: SchoolDTO;

    createdAt?: Date;
}