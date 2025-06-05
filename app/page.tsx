"use client";

import { PlatformSection } from "@/components/platform-section";
import { ArtisticHero } from "@/components/artistic-hero";
import { TopArts } from "@/components/top-arts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ArtisticHero />
        <div className="container py-16 space-y-24">
          {/* <TopArts /> */}
          <PlatformSection />
        </div>
      </main>
      <Footer/>
    </div>
  );
}
