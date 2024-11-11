import { db } from "@/lib/db";
import { Professor } from "@prisma/client";

export class ProfessorDAO {

    static async getAllProfessors(): Promise<Professor[]> {
        try {
            return await db.professor.findMany({
                where: { isDeleted: false },
                include: {
                    user: { select: { name: true }, },
                    grade: { select: { abbreviation: true } }
                },
            });

        } catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }



}