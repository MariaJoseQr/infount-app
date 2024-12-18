// import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { ProfessorThesisDTO } from "@/app/beans/dto/professorsThesisDTO";
import { db } from "@/lib/db";
//  import { Professor } from "@prisma/client";

export class ProfessorThesisDAO {

    static async getChargesByProfessorThesisIds(professorId: number, thesisIds: number[]): Promise<ProfessorThesisDTO[]> {
        try {
            const professorThesis: ProfessorThesisDTO[] = await db.professorTesis.findMany({
                where: {
                    thesisId: { in: thesisIds },
                    professorId: professorId,
                },
                // select:{
                //     id:true,professorId:true,thesisId:true, charge:true
                // },
                include: {
                    charge: {
                        select: {
                            id: true, name: true
                        }
                    }
                },
            });

            return professorThesis;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los datos");
        }
    }

    // static async getProfessorById(id: number): Promise<Professor | null> {
    //     return db.professor.findUnique({
    //         where: { id },
    //     });
    // }

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