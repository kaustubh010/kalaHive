"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  const loggedIn = !!session?.user;

  const user = session?.user
    ? {
        id: (session.user as any).id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  const profile = session?.user?.profile ?? null;

  const login = async (email: string, password: string) => {
    return await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  };

  const signInWithGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/auth/redirect",
    });
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return {
    loading,
    loggedIn,
    user,     // auth-related
    profile,  // db-related
    session,
    status,
    login,
    signInWithGoogle,
    logout,
  };
};
