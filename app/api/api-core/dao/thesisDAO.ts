import { ThesisDTO } from "@/app/beans/dto/thesisDTO";
import { db } from "@/lib/db";
import { Thesis, Prisma } from "@prisma/client";

export class ThesisDAO {

    static async getThesisById(id: number): Promise<Thesis | null> {
        try {
            return await db.thesis.findUnique({
                where: { id, isDeleted: false },
                include: {
                    type: { select: { name: true } },
                    professorsThesis: {
                        select: {
                            professor: { select: { user: { select: { name: true } } } },
                            charge: { select: { name: true } }
                        }
                    }
                },
            });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al obtener la tesis");
        }
    }

    static async getAllThesis(): Promise<ThesisDTO[]> {
        try {
            const thesis: ThesisDTO[] = await db.thesis.findMany({
                where: { isDeleted: false },
                select: {
                    id: true, name: true, resolutionCode: true, date: true, firstStudentName: true, secondStudentName: true, createdAt: true,
                    type: { select: { id: true, name: true } },
                    professorsThesis: {
                        select: {
                            professor: { select: { id: true, user: { select: { id: true, name: true } } } },
                            charge: { select: { id: true, name: true } },
                        },
                    },
                },
            });

            // Transformar los datos a ThesisDTO
            /*
            const thesisDTO: ThesisDTO[] = thesis.map((t) => ({
                id: t.id,
                name: t.name,
                resolutionCode: t.resolutionCode,
                date: t.date,
                firstStudentName: t.firstStudentName,
                secondStudentName: t.secondStudentName,
                type: t.type ? { id: t.type.id, name: t.type.name } : undefined,
                professorsThesis: t.professorsThesis?.map((pt) => ({
                    professor: {
                        id: pt.professor?.id,
                        user: { name: pt.professor?.user?.name },
                    },
                    charge: { name: pt.charge?.name },
                })),
                createdAt: t.createdAt,
            }));
            */

            return thesis;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener las tesis");
        }
    }

    static async getConstancyThesis(amount: number, professorId: number, thesisTypeIds: number[], chargeIds: number[], startDate?: Date, endDate?: Date) {
        try {
            const thesis = await db.thesis.findMany({
                where: {
                    isDeleted: false,
                    AND: [
                        thesisTypeIds.length > 0 ? {
                            type: { id: { in: thesisTypeIds }, },
                        } : {},
                        {
                            professorsThesis: {
                                some: {
                                    professorId: professorId,
                                    chargeId: chargeIds.length > 0 ? { in: chargeIds } : undefined,
                                },
                            },
                        },
                        // startDate ? { date: { gte: startDate } } : {},
                        // endDate ? { date: { lte: endDate } } : {},
                    ],
                },
                take: amount,
                select: {
                    id: true, name: true
                },
            });
            console.log("TESIIIIISES DAO: ", thesis)

            return thesis;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener las tesis");
        }
    }

    static async createThesis(data: Prisma.ThesisCreateInput): Promise<Thesis> {
        try {
            return await db.thesis.create({
                data,
                include: {
                    type: { select: { name: true } },
                    professorsThesis: {
                        select: {
                            professor: { select: { user: { select: { name: true } } } },
                            charge: { select: { name: true } }
                        }
                    }
                },
            });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la tesis");
        }
    }

    static async updateThesis(id: number, data: Prisma.ThesisUpdateInput): Promise<Thesis> {
        try {
            // Busca la tesis por ID y actualiza los campos
            return await db.thesis.update({
                where: { id },  // Filtra por el ID de la tesis
                data,  // Los datos para actualizar
                include: {
                    type: { select: { name: true } },
                    professorsThesis: {
                        select: {
                            professor: { select: { user: { select: { name: true } } } },
                            charge: { select: { name: true } }
                        }
                    }
                },
            });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al actualizar la tesis");
        }
    }

    static async deleteThesisById(id: number): Promise<Thesis> {
        try {
            return await db.thesis.update({
                where: { id },
                data: { isDeleted: true },
            });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al eliminar la tesis");
        }
    }
}