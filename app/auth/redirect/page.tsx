// app/auth/redirect/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/user/status");
        const { onboardingCompleted } = await res.json();

        if (onboardingCompleted) {
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding");
        }
      } catch (err) {
        console.error("Redirect failed", err);
        router.replace("/auth/login");
      }
    };

    checkStatus();
  }, [router]);

  return <p>Redirecting...</p>;
}
