import NextAuth, { NextAuthOptions, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface JWT {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token; // ✅ Adiciona o accessToken no JWT
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      session.accessToken = token.accessToken as string; // ✅ Agora o TypeScript reconhece o accessToken
      return session;
    },
  },
} as NextAuthOptions);

export { handler as GET, handler as POST };
