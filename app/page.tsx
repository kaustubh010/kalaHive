"use client";

import { TopArtists } from "@/components/top-artists";
import { PlatformSection } from "@/components/platform-section";
import { ArtisticHero } from "@/components/artistic-hero";
import { MainLayout } from "@/components/main-layout";

export default function Home() {
  return (
    <MainLayout>
      <ArtisticHero />
      <TopArtists />
      <PlatformSection />
    </MainLayout>
  );
}

