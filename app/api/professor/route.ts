import { NextRequest, NextResponse } from "next/server";
import { ProfessorService } from "../api-core/services/professorService";
import { ProfessorDTO } from "@/app/beans/dto/professorDTO";
import { CustomResponse } from "@/app/beans/customResponse";
import { ProfessorReq } from "@/app/beans/request/professorReq";

//GET ALL
export async function GET() {
    try {
        const response: CustomResponse<ProfessorDTO[]> = await ProfessorService.getAllProfessors();

        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al obtener los profesores");
    }
}

//GET COMBO - GET PAGINADO (TODO)


//INSERT
export async function POST(request: NextRequest) {
    try {
        const body: ProfessorReq = await request.json();

        //TODO: Validaciones para ver si ya existe usuario, correo, 

        const response: CustomResponse<number | null> = await ProfessorService.createProfessor(body);
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al insertar la tesis");
    }
}


//UPDATE
export async function PUT(request: NextRequest) {
    try {
        const body: ProfessorReq = await request.json();

        const response: CustomResponse<number | null> = await ProfessorService.updateProfessor(body);
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al insertar la tesis");
    }
}