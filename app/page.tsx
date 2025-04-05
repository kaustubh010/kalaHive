"use client";

import { TopArtists } from "@/components/top-artists";
import { PlatformSection } from "@/components/platform-section";
import { ArtisticHero } from "@/components/artistic-hero";
import { TopArts } from "@/components/top-arts";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <ArtisticHero />
        <div className="container py-16 space-y-24">
          <TopArtists />
          <TopArts />
          <PlatformSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

