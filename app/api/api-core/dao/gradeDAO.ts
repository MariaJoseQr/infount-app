import { GradeDTO } from "@/app/beans/dto/gradeDTO";
import { db } from "@/lib/db";
//  import { Professor } from "@prisma/client";

export class GradeDAO {

    static async getAllGrades(): Promise<GradeDTO[]> {
        try {
            const proffesors: GradeDTO[] = await db.grade.findMany({
                where: { isDeleted: false },
                select: {
                    id: true, name: true, abbreviation: true, createdAt: true
                },
            });
            return proffesors;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

}