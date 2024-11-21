// import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ThesisService } from "../thesisService";

//GET
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse(JSON.stringify({ message: "ID inválido" }), { status: 400 });
        }

        const thesis = await ThesisService.getThesisById(id);
        return new NextResponse(JSON.stringify({ message: "Tesis obtenida exitosamente", data: thesis }), { status: 200 });

    } catch (error) {
        if (error instanceof Error)
            return new NextResponse(error.message, { status: 404 });
        return new NextResponse("Error desconocido al obtener la tesis", { status: 500 });
    }
}

//DELETE
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse(JSON.stringify({ message: "ID inválido" }), { status: 400 });
        }

        await ThesisService.deleteThesisById(id);
        return new NextResponse(JSON.stringify({ message: "Tesis eliminada exitosamente" }), { status: 200 });

    } catch (error) {
        if (error instanceof Error)
            return new NextResponse(error.message, { status: 500 });
        return new NextResponse("Error desconocido al eliminar la tesis", { status: 500 });
    }
}