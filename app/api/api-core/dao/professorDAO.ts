import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { db } from "@/lib/db";
import { Professor } from "@prisma/client";
//  import { Professor } from "@prisma/client";

export class ProfessorDAO {

    static async getAllProfessors(): Promise<ProfessorDTO[]> {
        try {
            const proffesors: ProfessorDTO[] = await db.professor.findMany({
                where: { isDeleted: false },
                select: {
                    id: true, code: true,
                    user: {
                        select: {
                            id: true, name: true, username: true, email: true, schoolId: true, cellphone: true
                        },
                    },
                    grade: { select: { id: true, abbreviation: true } },
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return proffesors;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

    static async existsCode(code: string, id?: number): Promise<Professor | null> {
        try {

            const professor = await db.professor.findFirst({
                where: {
                    code: code,
                    isDeleted: false,
                    ...(id ? { id: { not: id } } : {})
                },
            });

            return professor; // Retorna el objeto si existe, null si no
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la tesis");
        }
    }

    static async createProfessor(data: { code: string; gradeId: number; userId: number }): Promise<ProfessorDTO> {
        try {
            const newProfessor = await db.professor.create({
                data: {
                    code: data.code,
                    grade: { connect: { id: data.gradeId } },
                    user: { connect: { id: data.userId } }, // Conectar el profesor con el usuario previamente creado
                },
                include: {
                    user: {
                        select: { id: true, name: true, cellphone: true, email: true }
                    },
                    grade: { select: { id: true, abbreviation: true } },

                },

            });


            const professorDTO: ProfessorDTO = {
                id: newProfessor.id,
                code: newProfessor.code,

                grade: newProfessor.grade,
                user: newProfessor.user,

                createdAt: newProfessor.createdAt,
            }


            return professorDTO;
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la tesis");
        }
    }

    static async getProfessorById(id: number): Promise<Professor | null> {
        return db.professor.findUnique({
            where: { id },
        });
    }

    static async updateProfessor(data: { id: number; code: string; gradeId: number; }): Promise<ProfessorDTO> {
        const updatedProfessor = await db.professor.update({
            where: { id: data.id },
            data: {
                code: data.code,
                grade: { connect: { id: data.gradeId } },
                updatedAt: new Date(),
            }, include: {
                user: {
                    select: { id: true, name: true, cellphone: true, email: true }
                },
                grade: { select: { id: true, abbreviation: true } },

            },

        });

        const professorDTO: ProfessorDTO = {
            id: updatedProfessor.id,
            code: updatedProfessor.code,
            grade: updatedProfessor.grade,
            user: updatedProfessor.user,
            createdAt: updatedProfessor.createdAt,
        }

        return professorDTO;
    }

    static async deleteProfessorByUserId(professorId: number): Promise<Professor> {
        try {
            // Realizar la actualización lógica del docente (marcarlo como eliminado)
            const updatedProfessor = await db.professor.update({
                where: { id: professorId },
                data: { isDeleted: true },
            });

            return updatedProfessor;
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al eleminar al docente");
        }
    }
}