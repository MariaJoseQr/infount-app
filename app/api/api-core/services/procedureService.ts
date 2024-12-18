// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { ThesisDAO } from "../dao/thesisDAO";
import { Prisma } from "@prisma/client";
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";
import { ProcedureDAO } from "../dao/procedureDAO";
import { ConstancyDAO } from "../dao/constancyDAO";
import { ConstancyThesisDAO } from "../dao/constancyThesisDAO";
import { ProcedureReq } from "@/app/beans/request/procedureReq";
// import { ProcedureDAO } from "../dao/procedureDAO";
// import { ConstancyDAO } from "../dao/constancyDAO";

export class ProcedureService {

    static async getThesisByProcedureId(id: number): Promise<CustomResponse<ProcedureDTO>> {
        try {
            // console.log("Datos recibidos:", data);
            if (!id)
                return new CustomResponse<ProcedureDTO>(null, ResultType.WARNING, "ID del trámite no proporcionado.", 400);

            const procedureDTO: ProcedureDTO | null = await ProcedureDAO.getProcedureCompleteById(id);
            console.log("procedure: ", procedureDTO)
            if (!procedureDTO) {
                return new CustomResponse<ProcedureDTO>(null, ResultType.WARNING, "Trámite no encontrado.", 404);
            }

            // const thesisDTO: ThesisDTO | null = await ConstancyThesisDAO.getConstancyThesis();
            // if (!thesisDTO) {
            //     return new CustomResponse<ProcedureDTO>(null, ResultType.WARNING, "Trámite no encontrado.", 404);
            // }



            return new CustomResponse<ProcedureDTO>(procedureDTO, ResultType.OK, "trámites o exitosamente.", 200);

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener el trámite");
        }
    }

    static async getAllProcedures(): Promise<CustomResponse<ProcedureDTO[]>> {
        try {
            const professors: ProcedureDTO[] = await ProcedureDAO.getAllProcedures();

            if (professors.length == 0)
                return new CustomResponse(professors, ResultType.WARNING, "Aun no se han registrado trámites", 204)

            return new CustomResponse(professors, ResultType.OK, "Trámites obtenidos exitosamente", 200)

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los trámites");
        }
    }

    static async createProcedure(data: ProcedureDTO): Promise<CustomResponse<number>> {
        try {
            if (data.registerTypes?.length === 0 || !data.professor || !data.constancy?.fileNumber || !data.constancy?.registrationNumber)
                return new CustomResponse<number>(null, ResultType.WARNING, "Faltan datos obligatorios para registrar el trámite.", 400);

            //TODO: Validaciones para ver si ya existe tramite (codigo, ver si el profesor ya tiene un tramite en proceso, profesor con mismos atributos de solicitud) 

            const thesis: ThesisDTO[] = await ThesisDAO.getThesisForConstancy(data.amount ?? 20, data.professor.id, data.registerTypes?.map(x => x.id) ?? [], data.charges ? data.charges.map(x => x.id) : [], data.startDate, data.endDate);
            console.log("TESIIIIISES: ", thesis)

            if (thesis.length === 0) {
                return new CustomResponse<number>(null, ResultType.WARNING, "No se encontraron tesis que cumplan con las condiciones especificadas", 404);
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

            return new CustomResponse<number>(newProcedure.id, ResultType.OK, "Trámite registrado exitosamente.", 201);

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al insertar el trámite");
        }
    }

    static async updateProcedure(data: ProcedureReq): Promise<CustomResponse<ProcedureDTO>> {
        try {
            // console.log("Datos recibidos:", data);
            if (!data.state)
                return new CustomResponse<ProcedureDTO>(null, ResultType.WARNING, " para actualizar el trámite.", 400);

            if (!data.id)
                return new CustomResponse<ProcedureDTO>(null, ResultType.WARNING, "ID del trámite no proporcionado.", 400);

            //TODO: VERIFICAR USUARIO EXISTENTE PERTENECE AL PROFESSOR
            const existingProcedure = await ProcedureDAO.getProcedureById(data.id);
            console.log("existingProcedure: ", existingProcedure)
            if (!existingProcedure) {
                return new CustomResponse<ProcedureDTO>(null, ResultType.WARNING, "Trámite no encontrado.", 404);
            }

            const updatedProcedure: ProcedureDTO = await ProcedureDAO.updateProcedure(data);
            console.log("updatedProcedure: ", updatedProcedure)

            return new CustomResponse<ProcedureDTO>(updatedProcedure, ResultType.OK, "Profesor actualizado exitosamente.", 200);

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