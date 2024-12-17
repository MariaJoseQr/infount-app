// import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { db } from "@/lib/db";
import { Prisma, Procedure } from "@prisma/client";
//  import { Professor } from "@prisma/client";

export class ProcedureDAO {

    static async getProcedureById(id: number): Promise<Procedure | null> {
        return db.procedure.findUnique({
            where: { id },
        });
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
            throw new Error("Error desconocido al registrar la tesis");
        }
    }



    // static async updateProfessor(data: { id: number; code: string; gradeId: number; }): Promise<Professor> {
    //     return db.professor.update({
    //         where: { id: data.id },
    //         data: {
    //             code: data.code,
    //             grade: { connect: { id: data.gradeId } },
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

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