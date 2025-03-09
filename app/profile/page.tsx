"use client";

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  return session ? <div>Welcome, {session.user.email}</div> : null;
}
