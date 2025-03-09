"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

interface Artist {
  id: number
  name: string
  specialty: string
  location: string
  profileImage: string
  followers: number
  bio: string
}

export function TopArtists() {
  const [artists] = useState<Artist[]>([
    {
      id: 1,
      name: "Sarah Chen",
      specialty: "Portrait Artist",
      location: "Vancouver, Canada",
      profileImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png",
      followers: 1234,
      bio: "Specializing in emotional black and white portraits that capture the essence of human expression.",
    },
    {
      id: 2,
      name: "James Wilson",
      specialty: "Wildlife Artist",
      location: "Melbourne, Australia",
      profileImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png",
      followers: 982,
      bio: "Dedicated to capturing the beauty and spirit of animals through detailed pencil work.",
    },
    {
      id: 3,
      name: "Mira Patel",
      specialty: "Character Artist",
      location: "Tokyo, Japan",
      profileImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png",
      followers: 2156,
      bio: "Creating unique characters that blend anime influences with personal style.",
    },
    {
      id: 4,
      name: "David Kim",
      specialty: "Traditional Artist",
      location: "Seoul, South Korea",
      profileImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-rXEcGxxJ8voxluF4GxRGBE1FOxRmy7.png",
      followers: 1567,
      bio: "Exploring the boundaries between traditional and contemporary art forms.",
    },
  ])

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("artist-scroll")
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Featured Artists</h2>
          <p className="text-muted-foreground mt-2">Discover talented artists from around the world</p>
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

      <div id="artist-scroll" className="scroll-container">
        {artists.map((artist) => (
          <div key={artist.id} className="scroll-item flex-none w-[300px]">
            <div className="bg-background/80 backdrop-blur-md rounded-lg border border-border/50 overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={artist.profileImage || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{artist.name}</h3>
                <p className="text-sm text-muted-foreground">{artist.specialty}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>{artist.location}</span>
                  <span>•</span>
                  <span>{artist.followers.toLocaleString()} followers</span>
                </div>
                <p className="mt-3 text-sm line-clamp-2">{artist.bio}</p>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/artists/${artist.id}`}>
                    View Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

