// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { ThesisDAO } from "../dao/thesisDAO";
import { Prisma } from "@prisma/client";
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";
import { ProcedureDAO } from "../dao/procedureDAO";
import { ConstancyDAO } from "../dao/constancyDAO";
import { ConstancyThesisDAO } from "../dao/constancyThesisDAO";
// import { ProcedureDAO } from "../dao/procedureDAO";
// import { ConstancyDAO } from "../dao/constancyDAO";

export class ProcedureService {

    static async getAllProcedures(): Promise<CustomResponse<ProcedureDTO[]>> {
        try {
            const professors: ProcedureDTO[] = await ProcedureDAO.getAllProcedures();

            if (professors.length == 0)
                return new CustomResponse(professors, ResultType.WARNING, "Aun no se han registrado professores", 204)

            return new CustomResponse(professors, ResultType.OK, "Profesores obtenidos exitosamente", 200)

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

    static async createProcedure(data: ProcedureDTO): Promise<CustomResponse<number>> {
        try {
            if (data.registerTypes?.length === 0 || !data.professor || !data.constancy?.fileNumber || !data.constancy?.registrationNumber)
                return new CustomResponse<number>(null, ResultType.WARNING, "Faltan datos obligatorios para registrar el trámite.", 400);

            //TODO: Validaciones para ver si ya existe tramite (codigo, ver si el profesor ya tiene un tramite en proceso, profesor con mismos atributos de solicitud) 

            const thesis: ThesisDTO[] = await ThesisDAO.getConstancyThesis(data.amount ?? 20, data.professor.id, data.registerTypes?.map(x => x.id) ?? [], data.charges ? data.charges.map(x => x.id) : [], data.endDate, data.startDate);
            console.log("TESIIIIISES: ", thesis)

            if (thesis.length === 0) {
                throw new Error("No se encontraron tesis que cumplan con las condiciones especificadas.");
            }

            //INERTAR PROCEDURE
            const procedureReq: Prisma.ProcedureCreateInput = {
                type: { connect: { id: 1 }, },
                state: { connect: { id: 1 }, },
                amount: data.amount ?? 20,
                thesisTypeIds: data.registerTypes?.map(item => item.id).join(",") || null,
                professor: { connect: { id: data.professor.id }, },
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                chargeIds: data.charges?.map(item => item.id).join(",") || null,
            };
            const newProcedure = await ProcedureDAO.createProcedure(procedureReq);
            console.log("newProcedure: ", newProcedure);

            //INERTAR CONSTANCY
            const constancyReq: Prisma.ConstancyCreateInput = {
                registrationNumber: data.constancy?.fileNumber,
                fileNumber: data.constancy?.registrationNumber,
                date: new Date(),
                procedureId: newProcedure.id,
                professor: { connect: { id: data.professor.id }, },
            }
            const newConstancy = await ConstancyDAO.createConstancy(constancyReq);
            console.log("newConstancy: ", newConstancy);

            //INSERT CONSTNACY-THESIS
            const constancyThesisReqs: Prisma.ConstancyThesisCreateInput[] = thesis.map(t => ({
                constancy: { connect: { id: newConstancy.id } }, // Conexión con la constancia
                thesis: { connect: { id: t.id } },              // Conexión con la tesis
            }));

            const constancyTheses = await ConstancyThesisDAO.createConstancyThesis(constancyThesisReqs);
            console.log("constancyTheses: ", constancyTheses);

            return new CustomResponse<number>(data.id, ResultType.OK, "Profesor registrado exitosamente.", 201);

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al insertar el trámite");
        }
    }

    static async updateProcedure(data: ProcedureDTO): Promise<CustomResponse<boolean>> {
        try {
            // console.log("Datos recibidos:", data);
            if (!data.state)
                return new CustomResponse<boolean>(null, ResultType.WARNING, " para actualizar el trámite.", 400);

            if (!data.id)
                return new CustomResponse<boolean>(null, ResultType.WARNING, "ID del trámite no proporcionado.", 400);


            //TODO: VERIFICAR USUARIO EXISTENTE PERTENECE AL PROFESSOR
            const existingProcedure = await ProcedureDAO.getProcedureById(data.id);
            console.log("existingProcedure: ", existingProcedure)
            if (!existingProcedure) {
                return new CustomResponse<boolean>(null, ResultType.WARNING, "Trámite no encontrado.", 404);
            }

            // if (!updatedProfessor)
            //     return new CustomResponse<boolean>(null, ResultType.ERROR, "Profesor no actualizado.", 404);

            return new CustomResponse<boolean>(true, ResultType.OK, "Profesor actualizado exitosamente.", 200);

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los docentes");
        }
    }

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