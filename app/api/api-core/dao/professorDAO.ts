import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { db } from "@/lib/db";
import { Professor } from "@prisma/client";
//  import { Professor } from "@prisma/client";

export class ProfessorDAO {

    static async getAllProfessors(): Promise<ProfessorDTO[]> {
        try {
            const proffesors: ProfessorDTO[] = await db.professor.findMany({
                where: { isDeleted: false },
                include: {
                    user: { select: { id: true, name: true }, },
                    grade: { select: { id: true, abbreviation: true } }
                },
            });
            return proffesors;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

    static async createProfessor(data: { code: string; gradeId: number; userId: number }): Promise<Professor> {
        try {
            const newProfessor = await db.professor.create({
                data: {
                    code: data.code,
                    grade: { connect: { id: data.gradeId } },
                    user: { connect: { id: data.userId } }, // Conectar el profesor con el usuario previamente creado
                },
            });
            return newProfessor;
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la tesis");
        }
    }

    static async getProfessorByUserId(userId: number): Promise<Professor | null> {
        return db.professor.findUnique({
            where: { userId },
        });
    }

    static async updateProfessor(data: { id: number; code: string; gradeId: number; userId: number }): Promise<Professor> {
        return db.professor.update({
            where: { id: data.id },
            data: {
                code: data.code,
                grade: { connect: { id: data.gradeId } },
                user: { connect: { id: data.userId } },
                updatedAt: new Date(),
            },
        });
    }

    static async deleteProfessorByUserId(userId: number): Promise<boolean> {
        try {
            // Realizar la actualización lógica del docente (marcarlo como eliminado)
            const updatedProfessor = await db.professor.update({
                where: { userId },
                data: { isDeleted: true },
            });

            return updatedProfessor ? true : false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}