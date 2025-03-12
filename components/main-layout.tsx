"use client";

import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSkeleton } from "@/components/loading-skeleton";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { loading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // This ensures we only render the loading state on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // If we're on the server or still initializing, show a skeleton
  if (!isClient || loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-2">{children}</main>
    </div>
  );
} 