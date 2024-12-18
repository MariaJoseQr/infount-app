import { CustomResponse } from "@/app/beans/customResponse";
import { ProcedureDTO } from "@/app/beans/dto/procedureDTO";
import { ProcedureService } from "../../api-core/services/procedureService";
import { NextRequest, NextResponse } from "next/server";


//GET CONSTANCY-THESIS
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        const response: CustomResponse<ProcedureDTO> = await ProcedureService.getThesisByProcedureId(id);

        return new NextResponse(JSON.stringify(response), { status: response.status });

    } catch (error) {
        if (error instanceof Error)
            console.error(error);
        throw new Error("Error desconocido al obtener el trámite");
    }
}