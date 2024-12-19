// import { db } from "@/lib/db";
import { CustomResponse } from "@/app/beans/customResponse";
import { NextResponse } from "next/server";
import { StateProcedureDTO } from "@/app/beans/dto/statusProcedureDTO";
import { StateService } from "../api-core/services/stateService";

export async function GET() {
    try {
        const response: CustomResponse<StateProcedureDTO[]> = await StateService.getAllStates();

        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al obtener los grados");
    }
}

