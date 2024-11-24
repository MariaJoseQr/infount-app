// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { ProfessorDAO } from "../dao/professorDAO";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { ProfessorReq } from "@/app/beans/request/professorReq";
import { User } from "@prisma/client";
import { UserDAO } from "../dao/userDAO";

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

            const userReq: User = {
                username: data.user.username,
                password: data.user.password,
                name: data.user.name,
                email: data.user.email,
                cellphone: data.user.cellphone,
                schoolId: 1,
                id: 0,
                isDeleted: false,
                createdAt: new Date(),
                creationUserId: null,
                updatedAt: null,
                updateUserId: null
            }

            const newUser = await UserDAO.createUser(userReq);

            const newProfessor = await ProfessorDAO.createProfessor({
                code: data.code,
                gradeId: data.gradeId,
                userId: newUser.id,
            });

            return new CustomResponse<number>(newProfessor.id, ResultType.OK, "Profesor registrado exitosamente.", 201);


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

            if (!data.user?.id) {
                return new CustomResponse<number>(null, ResultType.WARNING, "ID de usuario no proporcionado.", 400);
            }

            //TODO: VERIFICAR USUARIO EXISTENTE PERTENECE AL PROFESSOR
            const existingUser = await UserDAO.getUserById(data.user.id);
            if (!existingUser) {
                return new CustomResponse<number>(null, ResultType.WARNING, "Usuario no encontrado.", 404);
            }

            const updatedUser = await UserDAO.updateUser(data.user);

            const existingProfessor = await ProfessorDAO.getProfessorByUserId(data.user.id);
            if (!existingProfessor) {
                return new CustomResponse<number>(null, ResultType.WARNING, "Profesor no encontrado.", 404);
            }

            const updatedProfessor = await ProfessorDAO.updateProfessor({
                id: existingProfessor.id,
                code: data.code,
                gradeId: data.gradeId,
                userId: updatedUser.id,
            });

            return new CustomResponse<number>(updatedProfessor.id, ResultType.OK, "Profesor actualizado exitosamente.", 200);

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

            // Luego, eliminamos lógicamente al usuario asociado
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