import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Handler para las rutas GET y POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };