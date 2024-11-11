import { PrismaClient } from '@prisma/client';

// Crear una instancia del cliente Prisma
const db = new PrismaClient();

// Manejo de errores de conexión (opcional)
async function connectDB() {
    try {
        await db.$connect();
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1); // Termina la aplicación si no puede conectarse
    }
}

// Conectar a la base de datos al iniciar la aplicación
connectDB();

// Exportar la instancia del cliente para su uso en otras partes de la aplicación
export { db };
