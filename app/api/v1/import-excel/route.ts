import { validateRegisterArray } from "@/lib/utils";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    const data = await request.json();
    const result = validateRegisterArray(data);

    if (result.isValid) {
        const allTypes = await db.thesisType.findMany();

        for (const item of data) {
            const typeName = item["TIPO"];
            const typeRecord = allTypes.find(type => type.name === typeName);

            if (!typeRecord) {
                return new Response(JSON.stringify({ message: `Tipo no encontrado: ${typeName}` }), { status: 404 });
            }

            const thesis = {
                name: item["TITULO DE PROYECTO"],
                resolutionCode: item["CODIGO RESOLUCION DIRECTORAL Y/O DECANAL"],
                date: new Date(), // Cambia esto si tienes una fecha correcta en el objeto
                firstStudentName: item["BACHILLER 1"],
                secondStudentName: item["BACHILLER 2"] || null,
                type: {
                    connect: { id: typeRecord.id }
                }
            };

            const createdThesis = await db.thesis.create({ data: thesis });

            const roles = ["PRESIDENTE", "SECRETARIO", "VOCAL", "ASESOR"];
            for (const role of roles) {
                const professorCode = item[role];
                if (professorCode && professorCode !== "-") {
                    const professor = await db.professor.findFirst({
                        where: { code: String(professorCode), isDeleted: false }
                    });

                    if (professor) {
                        const charge = await db.charge.findFirst({
                            where: { name: role }
                        });

                        if (charge) {
                            await db.professorTesis.create({
                                data: {
                                    professorId: professor.id,
                                    thesisId: createdThesis.id,
                                    chargeId: charge.id
                                }
                            });
                        } else {
                            return new Response(JSON.stringify({ message: `Cargo no encontrado: ${role}` }), { status: 404 });
                        }
                    } else {
                        return new Response(JSON.stringify({ message: `Profesor no encontrado con código: ${professorCode}` }), { status: 404 });
                    }
                }
            }
        }

        return new Response(JSON.stringify({ message: "Tesis creada satisfactoriamennte" }), { status: 201 });
    } else {
        return new Response(JSON.stringify({ message: "Datos inválidos" }), { status: 400 });
    }
}
