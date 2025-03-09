"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/signup-form";
import { useAuth } from "@/hooks/use-auth";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <SignupForm />
      </div>
    </div>
  );
}

