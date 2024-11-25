// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { ProfessorDAO } from "../dao/professorDAO";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { ProfessorReq } from "@/app/beans/request/professorReq";
import { UserDAO } from "../dao/userDAO";
import { UserReq } from "@/app/beans/request/userReq";

export class ProfessorService {

    static async getAllProfessors(): Promise<CustomResponse<ProfessorDTO[]>> {
        try {
            const professors: ProfessorDTO[] = await ProfessorDAO.getAllProfessors();

            if (professors.length == 0)
                return new CustomResponse(professors, ResultType.WARNING, "Aun no se han registrado professores", 204)

            return new CustomResponse(professors, ResultType.OK, "Profesores obtenidos exitosamente", 200)

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

    static async createProfessor(data: ProfessorReq): Promise<CustomResponse<number>> {
        try {
            // console.log("Datos recibidos:", data);

            if (!data.user?.username || !data.user?.password || !data.user?.email
                || !data.user?.cellphone || !data.user?.cellphone || !data.code || !data.gradeId)
                return new CustomResponse<number>(null, ResultType.WARNING, "Faltan datos obligatorios para registrar al docente.", 400);

            //TODO: Validaciones para ver si ya existe usuario, correo, 

            const userReq: UserReq = {
                username: data.user.username,
                password: data.user.password,
                name: data.user.name,
                email: data.user.email,
                cellphone: data.user.cellphone,
                school: { id: 1 },
                id: 0,

            }

            const newUser = await UserDAO.createUser(userReq);

            const newProfessor = await ProfessorDAO.createProfessor({
                code: data.code,
                gradeId: data.gradeId,
                userId: newUser.id,
            });

            return new CustomResponse<number>(newProfessor.userId, ResultType.OK, "Profesor registrado exitosamente.", 201);


        } catch (error) {
            console.error(error);
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al insertar la tesis");
        }
    }

    static async updateProfessor(data: ProfessorReq): Promise<CustomResponse<number>> {
        try {
            // console.log("Datos recibidos:", data);
            if (!data.user?.username || !data.user?.password || !data.user?.email
                || !data.user?.cellphone || !data.code || !data.gradeId)
                return new CustomResponse<number>(null, ResultType.WARNING, "Faltan datos obligatorios para actualizar al docente.", 400);

            if (!data.id) {
                return new CustomResponse<number>(null, ResultType.WARNING, "ID del profesor no proporcionado.", 400);
            }

            //TODO: VERIFICAR USUARIO EXISTENTE PERTENECE AL PROFESSOR

            const existingProfessor = await ProfessorDAO.getProfessorById(data.id);
            // console.log("existingProfessor: ", existingProfessor)
            if (!existingProfessor) {
                return new CustomResponse<number>(null, ResultType.WARNING, "Profesor no encontrado.", 404);
            }

            const existingUser = await UserDAO.getUserById(existingProfessor.userId);
            // console.log("USER: ", existingUser)
            if (!existingUser) {
                return new CustomResponse<number>(null, ResultType.WARNING, "Usuario no encontrado.", 404);
            }
            data.user.id = existingUser.id;
            const updatedUser = await UserDAO.updateUser(data.user);

            const updatedProfessor = await ProfessorDAO.updateProfessor({
                id: existingProfessor.id,
                code: data.code,
                gradeId: data.gradeId
            });

            if (!updatedProfessor)
                return new CustomResponse<number>(null, ResultType.ERROR, "Profesor no actualizado.", 404);

            return new CustomResponse<number>(updatedUser.id, ResultType.OK, "Profesor actualizado exitosamente.", 200);

        } catch (error) {
            console.error(error);
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al insertar la tesis");
        }
    }

    static async deleteProfessorByUserId(id: number): Promise<CustomResponse<boolean>> {
        try {
            const professorDeleted = await ProfessorDAO.deleteProfessorByUserId(id);
            if (!professorDeleted) {
                return new CustomResponse<boolean>(false, ResultType.WARNING, 'No se encontró al docente.', 404);
            }

            const userDeleted = await UserDAO.deleteUserById(id);
            if (!userDeleted) {
                return new CustomResponse<boolean>(false, ResultType.WARNING, 'No se encontró al usuario asociado al docente.', 404);
            }

            return new CustomResponse<boolean>(true, ResultType.OK, 'Docente y usuario eliminados correctamente.', 200);
        } catch (error) {
            console.error("Error al eliminar profesor:", error);
            throw new Error("Error desconocido al eliminar al profesor.");
        }
    }


}