// import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { ConstancyThesisDTO } from "@/app/beans/dto/constancyThesisDTO";
import { db } from "@/lib/db";
import { ConstancyThesis, Prisma } from "@prisma/client";
//  import { Professor } from "@prisma/client";

export class ConstancyThesisDAO {

    static async getConstancyThesis(constancyId: number): Promise<ConstancyThesisDTO[]> {
        try {
            const constancyThesis = await db.constancyThesis.findMany({
                where: { constancyId: constancyId, isDeleted: false },
                include: {
                    thesis: {
                        select: {
                            id: true, name: true, resolutionCode: true, date: true, firstStudentName: true, secondStudentName: true,
                            type: {
                                select: { id: true, name: true }
                            },
                        },
                    },
                },
            });
            const constancyThesisDTO: ConstancyThesisDTO[] = constancyThesis.map(x => ({
                constancyId: x.constancyId,
                thesis: x.thesis
            } as ConstancyThesisDTO));
            // console.log("Thesis: ", constancyThesis)

            return constancyThesisDTO;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

    static async createConstancyThesis(constancyThesisReqs: Prisma.ConstancyThesisCreateInput[]): Promise<ConstancyThesis[]> {
        try {
            return await db.$transaction(
                constancyThesisReqs.map(req => db.constancyThesis.create({ data: req }))
            );
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la constancia-tesis");
        }
    }

    // static async getProfessorById(id: number): Promise<Professor | null> {
    //     return db.professor.findFirst({
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