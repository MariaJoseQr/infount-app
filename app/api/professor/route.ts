import { NextResponse } from "next/server";
import { ProfessorService } from "./professorService";

//GET ALL
export async function GET() {
    try {
        const professors = await ProfessorService.getAllProfessors();
        return new NextResponse(JSON.stringify({ message: "Profesores obtenidos exitosamente", data: professors }), { status: 200 });

    } catch (error) {
        if (error instanceof Error)
            throw new NextResponse(error.message, { status: 500 });
        throw new Error("Error desconocido al obtener los profesores");
    }
}

//INSERT



//UPDATE