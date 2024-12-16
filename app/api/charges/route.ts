// import { db } from "@/lib/db";
import { CustomResponse } from "@/app/beans/customResponse";
import { NextResponse } from "next/server";
import { ChargeDTO } from "@/app/beans/dto/chargeDTO";
import { ChargeService } from "../api-core/services/chargeService";

export async function GET() {
    try {
        const response: CustomResponse<ChargeDTO[]> = await ChargeService.getAllCharges();

        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al obtener los cargos");
    }
}

