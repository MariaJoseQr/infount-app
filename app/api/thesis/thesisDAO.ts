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

    static async getAllThesis(): Promise<Thesis[]> {
        try {
            return await db.thesis.findMany({
                where: { isDeleted: false },
                include: {
                    type: { select: { id: true, name: true } },
                    professorsThesis: { // Relación intermedia con los profesores
                        select: {
                            professor: { select: { id: true, user: { select: { name: true } } } },
                            charge: { select: { name: true } }
                        }
                    }
                },
            });

        } catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
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