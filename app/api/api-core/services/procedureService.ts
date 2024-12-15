// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";

export class ProcedureService {

    // static async getAllProfessors(): Promise<CustomResponse<ProfessorDTO[]>> {
    //     try {
    //         const professors: ProfessorDTO[] = await ProfessorDAO.getAllProfessors();

    //         if (professors.length == 0)
    //             return new CustomResponse(professors, ResultType.WARNING, "Aun no se han registrado professores", 204)

    //         return new CustomResponse(professors, ResultType.OK, "Profesores obtenidos exitosamente", 200)

    //     } catch (error) {
    //         if (error instanceof Error)
    //             console.error(error);
    //         throw new Error("Error desconocido al obtener los profesores");
    //     }
    // }

    static async createProcedure(data: ProcedureDTO): Promise<CustomResponse<number>> {
        try {
            // console.log("Datos recibidos:", data);

            if (data.registerTypes?.length === 0 || !data.professorDTO)
                return new CustomResponse<number>(null, ResultType.WARNING, "Faltan datos obligatorios para registrar el tramite.", 400);

            //TODO: Validaciones para ver si ya existe tramite (codigo, ver si el profesor ya tiene un tramite en proceso, profesor con mismos atributos de solicitud) 

            /*
            const procedureReq: Prisma.ProcedureCreateInput = {
                amount: data.amount ?? 20,
                thesisTypeIds: data.registerTypes?.join(",") || "",
                // professor: data.professorDTO.id,
                startDate: data.startDate ? new Date(data.startDate) : new Date(), 
                endDate: data.endDate ? new Date(data.endDate) : new Date(),
                chargeIds: data.charges?.join(",") || "", 
            };

            console.log(procedureReq);
*/

            // const newUser = await UserDAO.createUser(userReq);

            // const newProfessor = await ProfessorDAO.createProfessor({
            //     code: data.code,
            //     gradeId: data.gradeId,
            //     userId: newUser.id,
            // });

            return new CustomResponse<number>(data.id, ResultType.OK, "Profesor registrado exitosamente.", 201);


        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los docentes");
        }
    }

    // static async updateProfessor(data: ProfessorReq): Promise<CustomResponse<boolean>> {
    //     try {
    //         // console.log("Datos recibidos:", data);
    //         if (!data.name || !data.email || !data.cellphone || !data.code || !data.gradeId)
    //             return new CustomResponse<boolean>(null, ResultType.WARNING, "Faltan datos obligatorios para registrar al docente.", 400);

    //         if (!data.id) {
    //             return new CustomResponse<boolean>(null, ResultType.WARNING, "ID del profesor no proporcionado.", 400);
    //         }

    //         //TODO: VERIFICAR USUARIO EXISTENTE PERTENECE AL PROFESSOR

    //         const existingProfessor = await ProfessorDAO.getProfessorById(data.id);
    //         // console.log("existingProfessor: ", existingProfessor)
    //         if (!existingProfessor) {
    //             return new CustomResponse<boolean>(null, ResultType.WARNING, "Profesor no encontrado.", 404);
    //         }

    //         const existingUser = await UserDAO.getUserById(existingProfessor.userId);
    //         if (!existingUser) {
    //             return new CustomResponse<boolean>(null, ResultType.WARNING, "Usuario no encontrado.", 404);
    //         }
    //         const user: UserReq = {
    //             id: existingUser.id,
    //             password: existingUser.password,
    //             name: data.name,
    //             email: data.email,
    //             cellphone: data.cellphone
    //         }
    //         const updatedUser = await UserDAO.updateUser(user);
    //         console.log("updatedUser: ", updatedUser)
    //         const updatedProfessor = await ProfessorDAO.updateProfessor({
    //             id: existingProfessor.id,
    //             code: data.code,
    //             gradeId: data.gradeId
    //         });

    //         if (!updatedProfessor)
    //             return new CustomResponse<boolean>(null, ResultType.ERROR, "Profesor no actualizado.", 404);

    //         return new CustomResponse<boolean>(true, ResultType.OK, "Profesor actualizado exitosamente.", 200);

    //     } catch (error) {
    //         if (error instanceof Error)
    //             console.error(error);
    //         throw new Error("Error desconocido al obtener los docentes");
    //     }
    // }

    // static async deleteProfessorByUserId(id: number): Promise<CustomResponse<boolean>> {
    //     try {
    //         const professorDeleted = await ProfessorDAO.deleteProfessorByUserId(id);
    //         if (!professorDeleted) {
    //             return new CustomResponse<boolean>(false, ResultType.WARNING, 'No se encontró al docente.', 404);
    //         }

    //         const userDeleted = await UserDAO.deleteUserById(id);
    //         if (!userDeleted) {
    //             return new CustomResponse<boolean>(false, ResultType.WARNING, 'No se encontró al usuario asociado al docente.', 404);
    //         }

    //         return new CustomResponse<boolean>(true, ResultType.OK, 'Docente y usuario eliminados correctamente.', 200);
    //     } catch (error) {
    //         console.error("Error al eliminar profesor:", error);
    //         throw new Error("Error desconocido al eliminar al profesor.");
    //     }
    // }


}