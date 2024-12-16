import { ChargeDTO } from "@/app/beans/dto/chargeDTO";
import { db } from "@/lib/db";
//  import { Professor } from "@prisma/client";

export class ChargeDAO {

    static async getAllCharge(): Promise<ChargeDTO[]> {
        try {
            const proffesors: ChargeDTO[] = await db.charge.findMany({
                where: { isDeleted: false },
                select: {
                    id: true, name: true, createdAt: true
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