
import { UserDTO } from "../dto/userDTO";

export interface UserReq extends UserDTO {
    password: string;
}