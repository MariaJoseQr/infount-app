import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allTypes = await db.thesisType.findMany({
            where: { isDeleted: false },
        });

        if (!allTypes || allTypes.length === 0) {
            return new NextResponse(JSON.stringify({ message: "Tipos no encontrados" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(allTypes), { status: 200 });

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error al obtener los tipos de tesis", error }), { status: 500 });
    }
}

