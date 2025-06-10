"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react"
// import { getArtworks } from "@/utils/artwork"; // Removed
// import type { ArtworkWithArtist } from "@/utils/artwork"; // Removed

// Define a local type for artwork, assuming structure from API
interface ArtworkType {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  viewCount: number;
  likeCount: number;
  artist: {
    name?: string | null;
    // Add other artist fields if needed
  };
  // Add other fields if necessary
}

export function TopArts() {
  const [artworks, setArtworks] = useState<ArtworkType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedArtworks() {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch("/api/artworks");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to fetch artworks: ${res.status}`
          );
        }
        let fetchedArtworks: ArtworkType[] = await res.json();
        
        // Sort by viewCount (descending) and then limit to 6
        fetchedArtworks.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        setArtworks(fetchedArtworks.slice(0, 6));

      } catch (err: any) {
        console.error("Error fetching top artworks:", err);
        setError(err.message || "Failed to load top artworks");
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedArtworks()
  }, [])

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("artwork-scroll")
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Render loading placeholders
  const renderSkeletonArtworks = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex-none w-[320px] snap-start">
        <div className="bg-background/80 backdrop-blur-md rounded-lg border border-border/50 overflow-hidden h-full">
          <div className="aspect-[4/3] bg-muted animate-pulse"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="flex justify-between mt-3">
              <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
            </div>
            <div className="flex justify-between pt-2">
              <div className="h-5 bg-muted rounded animate-pulse w-1/5"></div>
              <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Top Artworks</h2>
          <p className="text-muted-foreground mt-2">Discover exceptional creations from our talented artists</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scrollContainer("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scrollContainer("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      <div id="artwork-scroll" className="flex gap-4 pb-4 overflow-x-auto hide-scrollbar snap-x">
        {loading ? (
          renderSkeletonArtworks()
        ) : artworks.length > 0 ? (
          artworks.map((artwork) => (
            <div key={artwork.id} className="flex-none w-[320px] snap-start">
              <div className="bg-background/80 backdrop-blur-md rounded-lg border border-border/50 overflow-hidden h-full">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={artwork.imageUrl || "/placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg line-clamp-1">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground">{artwork.category || "N/A"}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm">By {artwork.artist?.name || "Unknown Artist"}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" /> {artwork.viewCount || 0}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-3 w-3" /> {artwork.likeCount || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-primary font-medium">{/* No price yet */}</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/artwork/${artwork.id}`}>
                        View Details <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 py-12 text-center">
            <p>No featured artworks found. Check back soon!</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" asChild>
          <Link href="/explore">
            Explore All Artworks <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
} 