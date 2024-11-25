import { NextRequest, NextResponse } from "next/server";
import { ProfessorService } from "../../api-core/services/professorService";




//DELETE
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse(JSON.stringify({ message: "ID inválido" }), { status: 400 });
        }

        // Llamar al servicio para eliminar lógicamente el docente
        const response = await ProfessorService.deleteProfessorByUserId(Number(id));
        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            return new NextResponse(error.message, { status: 500 });
        return new NextResponse("Error desconocido al eliminar al docente", { status: 500 });
    }
}