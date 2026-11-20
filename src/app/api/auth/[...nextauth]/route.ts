import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { ensurePartnerUsers, getPartnerDisplayName } from "@/lib/ensureUsers";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Garante que as contas societárias existam no banco com a senha inicial padrão
        await ensurePartnerUsers();

        const cleanUsername = credentials.username.toLowerCase().trim();

        // Buscar usuário no banco PostgreSQL
        const user = await prisma.user.findUnique({
          where: {
            username: cleanUsername
          }
        });

        if (!user) {
          return null;
        }

        // Comparar senhas com bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        const displayName = getPartnerDisplayName(user.username);

        return {
          id: user.id,
          name: displayName,
          email: `${user.username}@avavitoria.com.br`
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = (user as any).email?.split("@")[0] || user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name as string;
        (session.user as any).username = token.username;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login", // Custom login page para manter a estética streetwear
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-123456",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
