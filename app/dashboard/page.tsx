"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/components/main-layout";
import { ArtistDashboard } from "@/components/artist-dashboard";
import { BuyerDashboard } from "@/components/buyer-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Palette, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // If no user type is set, show a selection screen
  if (profile && !profile.userType) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
              <CardDescription>
                Select how you'll primarily use Art Realm to personalize your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <Button 
                  size="lg" 
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => router.push("/onboarding/artist-setup")}
                >
                  <Palette className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">I'm an Artist</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    I want to showcase and sell my artwork
                  </span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => router.push("/onboarding/buyer-setup")}
                >
                  <ShoppingBag className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">I'm a Collector</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    I want to discover and collect artwork
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {profile?.userType === "artist" ? (
          <ArtistDashboard profile={profile} />
        ) : (
          <BuyerDashboard profile={profile} />
        )}
      </div>
    </MainLayout>
  );
}

