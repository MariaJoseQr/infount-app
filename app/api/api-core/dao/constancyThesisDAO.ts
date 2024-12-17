// import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { db } from "@/lib/db";
import { ConstancyThesis, Prisma } from "@prisma/client";
//  import { Professor } from "@prisma/client";

export class ConstancyThesisDAO {

    // static async getAllProfessors(): Promise<ProfessorDTO[]> {
    //     try {
    //         const proffesors: ProfessorDTO[] = await db.professor.findMany({
    //             where: { isDeleted: false },
    //             select: {
    //                 id: true, code: true,
    //                 user: {
    //                     select: {
    //                         id: true, name: true, username: true, email: true, schoolId: true, cellphone: true
    //                     },
    //                 },
    //                 grade: { select: { id: true, abbreviation: true } },
    //                 createdAt: true
    //             },
    //         });
    //         return proffesors;

    //     } catch (error) {
    //         if (error instanceof Error)
    //             console.error(error);
    //         throw new Error("Error desconocido al obtener los profesores");
    //     }
    // }

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