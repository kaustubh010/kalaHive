import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await compare(
          credentials!.password,
          user.hashedPassword
        );

        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/onboarding",
  },
callbacks: {
  async jwt({ token, user }) {
    // First time JWT is created, attach user info
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.name = user.name;
      token.image = user.image;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user && token?.id) {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        include: { profile: true },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.image = dbUser.image;
        session.user.profile = dbUser.profile; // include full profile
      }
    }

    return session;
  },
}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
