import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "*****" },
            },
            async authorize(credentials) { //, req
                console.log(credentials)

                const userFound = await db.user.findFirst({
                    where: {
                        username: credentials?.email
                    }
                })

                if (!userFound) throw new Error('Usuario no encontrado')

                console.log(userFound)
                if (!credentials || !credentials.password)
                    throw new Error('Contraseña no válida')

                const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

                if (!matchPassword) throw new Error('Contraseña Incorrecta')

                return {
                    id: userFound.id.toString(),
                    name: userFound.username,
                    email: userFound.email,
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    }
};


// Handler para las rutas GET y POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };