import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth/next";

export const runtime = "nodejs";
export const maxDuration = 60; // Maximum allowed on Vercel hobby plan

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
