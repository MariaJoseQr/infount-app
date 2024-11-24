
import { db } from "@/lib/db";
import { User } from "@prisma/client";


export class UserDAO {

    static async getUserById(id: number): Promise<User | null> {
        if (!id) {
            throw new Error("El ID del usuario es necesario");
        }
        return db.user.findUnique({
            where: { id }
        });
    }

    /*
    static async getAllProfessors(): Promise<ProfessorDTO[]> {
        try {
            const proffesors: ProfessorDTO[] = await db.professor.findMany({
                where: { isDeleted: false },
                include: {
                    user: { select: { id: true, name: true }, },
                    grade: { select: { id: true, abbreviation: true } }
                },
            });
            return proffesors;

        } catch (error) {
            if (error instanceof Error)
                console.error(error);
            throw new Error("Error desconocido al obtener los profesores");
        }
    }
    */
    static async createUser(data: User): Promise<User> {
        try {
            const newUser = await db.user.create({
                data: {
                    username: data.username,
                    password: data.password,
                    name: data.name,
                    email: data.email,
                    cellphone: data.cellphone,
                    school: { connect: { id: data.schoolId } }, // Asegúrate de incluir el schoolId
                },
            });
            return newUser;
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
            throw new Error("Error desconocido al registrar la tesis");
        }
    }

    static async updateUser(data: User): Promise<User> {
        return db.user.update({
            where: { id: data.id },
            data: {
                username: data.username,
                password: data.password,
                name: data.name,
                email: data.email,
                cellphone: data.cellphone,
                updatedAt: new Date(),
            },
        });
    }

    static async deleteUserById(id: number): Promise<boolean> {
        try {
            // Buscar al usuario asociado al profesor
            const user = await db.user.findUnique({
                where: { id },
            });

            if (!user) return false;

            // Realizar la actualización lógica del usuario (marcarlo como eliminado)
            const updatedUser = await db.user.update({
                where: { id: user.id },
                data: { isDeleted: true },
            });

            return updatedUser ? true : false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}