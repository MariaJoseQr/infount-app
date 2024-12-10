// import { db } from "@/lib/db";
import { CustomResponse } from "@/app/beans/customResponse";
import { GradeDTO } from "@/app/beans/dto/gradeDTO";
import { NextResponse } from "next/server";
import { GradeService } from "../api-core/services/gradeService";

export async function GET() {
    try {
        const response: CustomResponse<GradeDTO[]> = await GradeService.getAllGrades();

        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al obtener los grados");
    }
}

