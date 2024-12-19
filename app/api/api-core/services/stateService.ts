// import { Professor } from "@prisma/client";

import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { StateProcedureDTO } from "@/app/beans/dto/statusProcedureDTO";
import { StateDAO } from "../dao/stateDAO";
export class StateService {

    static async getAllStates(): Promise<CustomResponse<StateProcedureDTO[]>> {
        try {
            const states: StateProcedureDTO[] = await StateDAO.getAllStates();

            if (states.length == 0)
                return new CustomResponse(states, ResultType.WARNING, "Aun no se han registrado estados", 204)

            return new CustomResponse(states, ResultType.OK, "Estados obtenidos exitosamente", 200)

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los estados");
        }
    }

}