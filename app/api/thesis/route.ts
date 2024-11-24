// import { db } from "@/lib/db";
// import { validateOneThesis } from "@/lib/utils";
import { ThesisService } from "../api-core/services/thesisService";
import { NextRequest, NextResponse } from "next/server";
import { CustomResponse } from "@/app/beans/customResponse";
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";


//GET ALL
export async function GET() {
    try {
        const response: CustomResponse<ThesisDTO[]> = await ThesisService.getAllThesis();
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al obtener las tesis");
    }
}

//INSERT
export async function POST(request: NextRequest) {
    try {
        const body: ThesisDTO = await request.json();

        const response: CustomResponse<number> = await ThesisService.createThesis(body);
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al insertar la tesis");
    }
}

// UPDATE
export async function PUT(request: NextRequest) {
    try {
        const body: ThesisDTO = await request.json();

        const response: CustomResponse<number> = await ThesisService.updateThesis(body);
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al insertar la tesis");
    }
}