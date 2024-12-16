// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { GradeDTO } from "@/app/beans/dto/gradeDTO";
import { GradeDAO } from "../dao/gradeDAO";
export class GradeService {

    static async getAllGrades(): Promise<CustomResponse<GradeDTO[]>> {
        try {
            const grades: GradeDTO[] = await GradeDAO.getAllGrades();

            if (grades.length == 0)
                return new CustomResponse(grades, ResultType.WARNING, "Aun no se han registrado grados", 204)

            return new CustomResponse(grades, ResultType.OK, "Profesores obtenidos exitosamente", 200)

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los grados");
        }
    }


}