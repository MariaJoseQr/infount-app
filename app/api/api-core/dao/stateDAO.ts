import { StateProcedureDTO } from "@/app/beans/dto/statusProcedureDTO";
import { db } from "@/lib/db";
//  import { Professor } from "@prisma/client";

export class StateDAO {

    static async getAllStates(): Promise<StateProcedureDTO[]> {
        try {
            const states: StateProcedureDTO[] = await db.state.findMany({
                where: { isDeleted: false },
                select: {
                    id: true, name: true, createdAt: true
                },
            });
            return states;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

}