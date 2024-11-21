import { ThesisDAO } from "./thesisDAO";
import { Prisma } from "@prisma/client";
import { validateOneThesis } from "@/lib/utils";

export class ThesisService {

    static async getThesisById(id: number) {
        const thesis = await ThesisDAO.getThesisById(id);
        if (!thesis) {
            throw new Error("Tesis no encontrada");
        }
        return thesis;
    }

    static async getAllThesis() {
        const thesis = await ThesisDAO.getAllThesis();

        return thesis;
    }

    static async createThesis(data: { name: string; resolutionCode: string; date: string; firstStudentName: string; secondStudentName?: string; typeId: number; professors: { professorId: number; chargeId: number }[]; }) {
        const { name, resolutionCode, date, firstStudentName, typeId, professors } = data;

        console.log("Breakpoint 2: ", data);
        // Validar datos obligatorios
        if (!name || !resolutionCode || !firstStudentName || !typeId || !professors || professors.length === 0) {
            throw new Error("Faltan datos necesarios para crear la tesis");
        }

        // Validar lógica adicional
        if (!validateOneThesis(data)) { }

        const newThesisData: Prisma.ThesisCreateInput = {
            name,
            resolutionCode,
            date: new Date(date),
            firstStudentName,
            secondStudentName: data.secondStudentName ? data.secondStudentName : '', //TODO
            type: { connect: { id: typeId } },
            professorsThesis: {
                create: professors.map((professor) => ({
                    professor: { connect: { id: professor.professorId } },
                    charge: { connect: { id: professor.chargeId } },
                })),
            },
        };

        return await ThesisDAO.createThesis(newThesisData);
    }

    static async updateThesis(id: number, data: {
        name?: string;
        resolutionCode?: string;
        date?: string;
        firstStudentName?: string;
        secondStudentName?: string;
        typeId?: number;
        professors?: { professorId: number; chargeId: number }[];
    }) {
        // Validar datos obligatorios para actualización
        if (!id) {
            throw new Error("El ID de la tesis es requerido para actualizar.");
        }

        const updateData: Prisma.ThesisUpdateInput = {
            name: data.name,
            resolutionCode: data.resolutionCode,
            date: data.date,
            firstStudentName: data.firstStudentName,
            secondStudentName: data.secondStudentName,
            type: data.typeId ? { connect: { id: data.typeId } } : undefined,
            professorsThesis: data.professors ? {
                deleteMany: {},  // Borra los registros previos de la relación con los profesores
                create: data.professors.map((professor) => ({
                    professor: { connect: { id: professor.professorId } },
                    charge: { connect: { id: professor.chargeId } },
                }))
            } : undefined,
        };

        return await ThesisDAO.updateThesis(id, updateData);
    }

    static async deleteThesisById(id: number) {
        const thesis = await ThesisDAO.deleteThesisById(id);
        if (!thesis) {
            throw new Error("Error al eliminar la tesis");
        }
        return thesis;
    }
}

