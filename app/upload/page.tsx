"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArtUploadForm } from "@/components/art-upload-form";
import { MainLayout } from "@/components/main-layout";
import { useAuth } from "@/hooks/use-auth";

export default function UploadPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Artwork</h1>
        <ArtUploadForm />
      </div>
    </MainLayout>
  );
} 