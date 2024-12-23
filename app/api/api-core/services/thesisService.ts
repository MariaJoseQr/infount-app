import { ThesisDAO } from "../dao/thesisDAO";
import { Prisma } from "@prisma/client";
import { validateOneThesis } from "@/lib/utils";
import { ThesisDTO } from "@/app/beans/dto/thesisDTO";
import { CustomResponse, ResultType } from "@/app/beans/customResponse";

export class ThesisService {

    static async getThesisById(id: number) {
        const thesis = await ThesisDAO.getThesisById(id);
        if (!thesis) {
            throw new Error("Tesis no encontrada");
        }
        return thesis;
    }

    static async getAllThesis(): Promise<CustomResponse<ThesisDTO[]>> {
        try {
            const thesis: ThesisDTO[] = await ThesisDAO.getAllThesis();
            if (thesis.length == 0)
                return new CustomResponse(thesis, ResultType.WARNING, "Aun no se han registrado tesis", 204)

            return new CustomResponse(thesis, ResultType.OK, "Tesis obtenidas exitosamente", 200)

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

    static async createThesis(data: ThesisDTO): Promise<CustomResponse<ThesisDTO>> {
        try {
            // console.log("Datos recibidos:", data);

            if (!data.name || !data.resolutionCode || !data.firstStudentName || !data.type?.id || !data.professorsThesis || data.professorsThesis.length === 0)
                return new CustomResponse<ThesisDTO>(null, ResultType.WARNING, "Faltan datos obligatorios para registrar la tesis.", 400);

            if (!validateOneThesis(data))
                return new CustomResponse<ThesisDTO>(null, ResultType.WARNING, "La lógica de validación adicional no se cumplió.", 400);

            //TODO: Si pueden repetirse nombres? 
            // const existingName = await ThesisDAO.existsName(data.name);
            // if (existingName != null) {
            //     return new CustomResponse<ThesisDTO>(null, ResultType.WARNING, "El nombre del registro ya existe.", 422);
            // }

            // Preparar datos para la inserción
            const newThesisData: Prisma.ThesisCreateInput = {
                name: data.name,
                resolutionCode: data.resolutionCode,
                date: data.date ? new Date(data.date) : null,
                firstStudentName: data.firstStudentName,
                secondStudentName: data.secondStudentName || '',
                type: { connect: { id: data.type.id } },
                professorsThesis: {
                    create: data.professorsThesis.map(pt => ({
                        professor: { connect: { id: pt.professor?.id } },
                        charge: { connect: { id: pt.charge?.id } },
                    })),
                },
            };

            const newThesisDTO: ThesisDTO = await ThesisDAO.createThesis(newThesisData);

            return new CustomResponse<ThesisDTO>(newThesisDTO, ResultType.OK, "Tesis registrada exitosamente.", 201);

        } catch (error) {
            console.error(error);
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al insertar la tesis");
        }
    }

    static async updateThesis(data: ThesisDTO): Promise<CustomResponse<ThesisDTO>> {
        try {
            console.log("Datos recibidos para actualización:", data);

            // Validar datos obligatorios
            if (!data.id)
                return new CustomResponse<ThesisDTO>(null, ResultType.ERROR, "El ID de la tesis es requerido para actualizar.", 500);

            if (!data.name || !data.resolutionCode || !data.firstStudentName || !data.type?.id)
                return new CustomResponse<ThesisDTO>(null, ResultType.WARNING, "Faltan datos obligatorios para actualizar la tesis.", 400);

            // Preparar datos para la actualización
            const updateData: Prisma.ThesisUpdateInput = {
                name: data.name,
                resolutionCode: data.resolutionCode,
                date: data.date ? new Date(data.date) : null,
                firstStudentName: data.firstStudentName,
                secondStudentName: data.secondStudentName || '',
                type: { connect: { id: data.type.id } },
                professorsThesis: data.professorsThesis
                    ? {
                        deleteMany: {}, // Borra las relaciones existentes
                        create: data.professorsThesis.map(pt => ({
                            professor: { connect: { id: pt.professor?.id } },
                            charge: { connect: { id: pt.charge?.id } },
                        })),
                    }
                    : undefined,
            };

            const updatedThesis = await ThesisDAO.updateThesis(data.id, updateData);

            return new CustomResponse<ThesisDTO>(updatedThesis, ResultType.OK, "Tesis actualizada exitosamente.", 200);

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }

    static async deleteThesisById(id: number) {
        const thesis = await ThesisDAO.deleteThesisById(id);
        if (!thesis) {
            throw new Error("Error al eliminar la tesis");
        }
        return thesis;
    }
}

