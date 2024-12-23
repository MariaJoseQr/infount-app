// import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { ConstancyDTO } from "@/app/beans/dto/constancyDTO";
import { db } from "@/lib/db";
import { Constancy, Prisma } from "@prisma/client";
//  import { Professor } from "@prisma/client";

export class ConstancyDAO {

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

    static async createConstancy(constancyData: Prisma.ConstancyCreateInput): Promise<Constancy> {
        try {
            return await db.constancy.create({
                data: constancyData,
            });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la constancia");
        }
    }

    static async getConstancyByProcedureId(procedureId: number): Promise<ConstancyDTO | null> {
        const constancy = await db.constancy.findFirst({
            where: { procedureId: procedureId, isDeleted: false }
        });

        const constancyDTO: ConstancyDTO = {
            id: constancy?.id,
            registrationNumber: constancy?.registrationNumber,
            fileNumber: constancy?.fileNumber,
        }
        return constancyDTO;
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