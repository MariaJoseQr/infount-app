// import { db } from "@/lib/db";
import { CustomResponse, ResultType } from "@/app/beans/customResponse";
import { NextRequest, NextResponse } from "next/server";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { ProcedureService } from "../api-core/services/procedureService";
import { ProcedureReq } from "@/app/beans/request/procedureReq";

export async function GET() {
    try {
        const response: CustomResponse<ProcedureDTO[]> = await ProcedureService.getAllProcedures();

        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al obtener los trámites");
    }
}

/*INSERT (procedure_type = constancia)*/
export async function POST(request: NextRequest) {
    try {
        console.log("request: ", request)
        const body: ProcedureDTO = await request.json();

        console.log("body: ", body)

        const response: CustomResponse<ProcedureDTO> = await ProcedureService.createProcedure(body);
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        console.error(error);
        const response = new CustomResponse(null, ResultType.ERROR, "Error desconocido al insertar el trámite", 500);
        return new NextResponse(JSON.stringify(response), { status: response.status });
    }
}

// UPDATE
export async function PUT(request: NextRequest) {
    try {
        const body: ProcedureReq = await request.json();

        const response: CustomResponse<ProcedureDTO> = await ProcedureService.updateProcedure(body);
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al insertar la tesis");
    }
}
