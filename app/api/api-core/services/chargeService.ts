// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { GradeDTO } from "@/app/beans/dto/gradeDTO";
import { ChargeDTO } from "@/app/beans/dto/chargeDTO";
import { ChargeDAO } from "../dao/chargeDAO";
export class ChargeService {

    static async getAllCharges(): Promise<CustomResponse<GradeDTO[]>> {
        try {
            const charge: ChargeDTO[] = await ChargeDAO.getAllCharge();

            if (charge.length == 0)
                return new CustomResponse(charge, ResultType.WARNING, "Aun no se han registrado cargos", 204)

            return new CustomResponse(charge, ResultType.OK, "Cargos obtenidos exitosamente", 200)

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los cargos");
        }
    }

}