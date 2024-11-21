// import { db } from "@/lib/db";
// import { validateOneThesis } from "@/lib/utils";
import { ThesisService } from "./thesisService";
import { NextRequest, NextResponse } from "next/server";


//GET ALL
export async function GET() {
    try {
        const thesis = await ThesisService.getAllThesis();
        return new NextResponse(JSON.stringify({ message: "Tesis obtenidos exitosamente", data: thesis }), { status: 200 });

    } catch (error) {
        if (error instanceof Error)
            throw new NextResponse(error.message, { status: 500 });
        throw new Error("Error desconocido al obtener las thesis");
    }
}

//INSERT
export async function POST(request: NextRequest) {
    try {
        console.log("Breakpoint: ");
        const { name, resolutionCode, date, firstStudentName, secondStudentName, typeId, professors } = await request.json();


        const newThesis = await ThesisService.createThesis({
            name,
            resolutionCode,
            date,
            firstStudentName,
            secondStudentName,
            typeId,
            professors,
        });

        return new NextResponse(
            JSON.stringify({ message: "Tesis registrada exitosamente", data: newThesis }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error al registrar la tesis:", error);

        if (error instanceof Error) {
            return new NextResponse(
                JSON.stringify({ message: "Error al registrar la tesis", error: error.message }),
                { status: 500 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "Error desconocido al registrar la tesis" }),
            { status: 500 }
        );
    }
}
/*
export async function POST(request: NextRequest) {
    try {

        const {
            thesis, name, resolutionCode, date, firstStudentName, secondStudentName, typeId, professors, } = await request.json();
        // Validar que se reciban los datos necesarios
        if (!name || !resolutionCode || !firstStudentName || !typeId || !professors) {
            return new NextResponse(
                JSON.stringify({ message: "Faltan datos necesarios para crear la tesis" }),
                { status: 400 }
            );
        }
        const result = validateOneThesis(thesis);
        if (result) {
            const newThesis = await db.thesis.create({
                data: {
                    name, resolutionCode, date: new Date(date), firstStudentName, secondStudentName, typeId, professorsThesis: {
                        create: professors.map((professor: { professorId: number; chargeId: number }) => ({
                            professorId: professor.professorId,
                            chargeId: professor.chargeId,
                        })),
                    },
                },
            });
            return new NextResponse(
                JSON.stringify({ message: "Tesis registrada exitosamente", data: newThesis }),
                { status: 201 }
            );
        }


    } catch (error) {
        console.error("Error al registrar la tesis:", error);

        if (error instanceof Error) {
            return new NextResponse(
                JSON.stringify({ message: "Error al registrar la tesis", error: error.message }),
                { status: 500 }
            );
        } else {
            throw new Error("An unknown error occurred");
        }

    }
}
*/

//UPDATE
export async function PUT(request: NextRequest) {
    try {

        const { id, name, resolutionCode, date, firstStudentName, secondStudentName, typeId, professors, } = await request.json();

        // Validación de los campos necesarios
        if (!id) {
            return new NextResponse(
                JSON.stringify({ message: "Falta el ID de la tesis" }),
                { status: 400 }
            );
        }

        const updatedThesis = await ThesisService.updateThesis(id, {
            name,
            resolutionCode,
            date,
            firstStudentName,
            secondStudentName,
            typeId,
            professors,
        });

        return new NextResponse(
            JSON.stringify({ message: "Tesis actualizada exitosamente", data: updatedThesis }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al actualizar la tesis:", error);

        if (error instanceof Error) {
            return new NextResponse(
                JSON.stringify({ message: "Error al actualizar la tesis", error: error.message }),
                { status: 500 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "Error desconocido al actualizar la tesis" }),
            { status: 500 }
        );
    }
}