// import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { ProcedureReq } from "@/app/beans/request/procedureReq";
import { db } from "@/lib/db";
import { Prisma, Procedure } from "@prisma/client";

export class ProcedureDAO {

    static async getProcedureById(id: number): Promise<Procedure | null> {
        const procedure = await db.procedure.findFirst({
            where: { id, isDeleted: false },
        });
        return procedure;
    }

    static async getProcedureCompleteById(id: number): Promise<ProcedureDTO | null> {
        const procedureModel = await db.procedure.findFirst({
            where: { id, isDeleted: false },
            include: {
                professor: {
                    select: {
                        id: true, grade: { select: { id: true, abbreviation: true } },
                        user: {
                            select: { id: true, name: true }
                        }
                    },
                },
                state: {
                    select: { id: true, name: true }
                }
            }
        });

        if (!procedureModel) {
            return null;
        }
        console.log("procedureModel: ", procedureModel)
        const procedureDTO: ProcedureDTO = {
            id: procedureModel.id,
            registerTypes: procedureModel.thesisTypeIds?.split(',').map(id => ({ id: parseInt(id) })),
            professor: procedureModel.professor,
            amount: procedureModel.amount,
            startDate: procedureModel.startDate ?? undefined,
            endDate: procedureModel.endDate ?? undefined,
            state: procedureModel.state,
            charges: procedureModel.chargeIds?.split(',').map(id => ({ id: parseInt(id) })),
            // constancy: procedureModel.constancy ?? undefined,
            createdAt: procedureModel.createdAt
        }

        return procedureDTO;
    }

    static async getAllProcedures(): Promise<ProcedureDTO[]> {
        try {
            const procedures: ProcedureDTO[] = await db.procedure.findMany({
                where: { isDeleted: false },
                select: {
                    id: true, state: true,
                    professor: {
                        select: {
                            id: true, grade: { select: { id: true, abbreviation: true } },
                            user: {
                                select: { id: true, name: true }
                            }
                        },
                    },
                    createdAt: true
                },
            });
            return procedures;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los trámites");
        }
    }

    static async createProcedure(procedureData: Prisma.ProcedureCreateInput): Promise<Procedure> {
        try {
            return await db.procedure.create({
                data: procedureData,
            });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la trámite");
        }
    }

    static async updateProcedure(data: ProcedureReq): Promise<ProcedureDTO> {
        const procedureUpdated = await db.procedure.update({
            where: { id: data.id },
            data: { stateId: data.state.id, },
            include: {
                professor: {
                    select: {
                        id: true, grade: { select: { id: true, abbreviation: true } },
                        user: {
                            select: { id: true, name: true }
                        }
                    },
                },
                state: {
                    select: { id: true, name: true }
                }
            }
        });

        const procedureDTO: ProcedureDTO = {
            id: procedureUpdated.id,
            registerTypes: procedureUpdated.thesisTypeIds?.split(',').map(id => ({ id: parseInt(id) })),
            professor: procedureUpdated.professor,
            amount: procedureUpdated.amount,
            startDate: procedureUpdated.startDate ?? undefined,
            endDate: procedureUpdated.endDate ?? undefined,
            state: procedureUpdated.state,
            charges: procedureUpdated.chargeIds?.split(',').map(id => ({ id: parseInt(id) })),
            createdAt: procedureUpdated.createdAt
        }

        return procedureDTO;
    }

    // static async deleteProfessorByUserId(userId: number): Promise<boolean> {
    //     try {
    //         // Realizar la actualización lógica del docente (marcarlo como eliminado)
    //         const updatedProfessor = await db.professor.update({
    //             where: { userId },
    //             data: { isDeleted: true },
    //         });

    //         return updatedProfessor ? true : false;
    //     } catch (error) {
    //         console.error(error);
    //         return false;
    //     }
    // }
}