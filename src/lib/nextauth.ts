import { getServerLocalUser } from "./serverLocalUser";
import { NextAuthOptions } from "next-auth";

// Define a type for our local user session
export interface LocalUserSession {
  user: {
    id: string;
    name: string;
  };
}

// Function to get the local user session
export const getAuthSession = async (): Promise<LocalUserSession | null> => {
  return getServerLocalUser();
};

// Define authOptions for NextAuth
export const authOptions: NextAuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
      // We're not using real authentication, so we'll just return the session as is
      return session;
    },
    async jwt({ token }) {
      // We're not using real authentication, so we'll just return the token as is
      return token;
    },
  },
};
