"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { getArtworkById, hasUserLikedArtwork, toggleArtworkLike } from "@/utils/artwork";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Eye, Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { ArtworkWithArtist } from "@/utils/artwork";
import { use } from "react";

export default function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState<ArtworkWithArtist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Fetch artwork data
  useEffect(() => {
    const fetchArtwork = async () => {
      setError(null);

      try {
        const { artwork: fetchedArtwork, error } = await getArtworkById(resolvedParams.id);

        if (error) {
          console.error("Error fetching artwork:", error);
          throw new Error(error.message || "Failed to fetch artwork");
        }

        if (!fetchedArtwork) {
          throw new Error("Artwork not found");
        }

        setArtwork(fetchedArtwork);
        setLikeCount(fetchedArtwork.like_count);

        // Check if the user has liked this artwork
        if (user) {
          const { liked: hasLiked } = await hasUserLikedArtwork(fetchedArtwork.id);
          setLiked(hasLiked);
        }
      } catch (err: any) {
        console.error("Error fetching artwork:", err);
        setError(err.message || "Failed to load artwork. Please try again later.");
      }
    };

    fetchArtwork();
  }, [resolvedParams.id, user]);

  // Handle like button click
  const handleLikeClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isLikeLoading || !artwork) return;

    setIsLikeLoading(true);
    try {
      const { liked: newLikedStatus } = await toggleArtworkLike(artwork.id);
      setLiked(newLikedStatus);
      setLikeCount((prev) => (newLikedStatus ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get artist initials for avatar fallback
  const getArtistInitials = () => {
    if (artwork?.profiles.fullName) {
      return artwork.profiles.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return "AR"; // Art Realm default
  };

  if (error) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">
              {error || "Artwork not found"}
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!artwork) {
    return (
      <MainLayout>
        <div className="container py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skeleton for artwork image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted animate-pulse"></div>
            
            {/* Skeleton for artwork details */}
            <div>
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-6"></div>
              
              <div className="flex items-center gap-3 mt-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div>
                  <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mt-1"></div>
                </div>
              </div>
              
              <div className="my-6 h-px bg-muted"></div>
              
              <div className="flex gap-6 mb-6">
                <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
              </div>
              
              <div className="mb-6">
                <div className="h-6 w-32 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Artwork Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={artwork.image_url}
              alt={artwork.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Artwork Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
            
            {/* Artist Info */}
            <Link
              href={`/artist/${artwork.profiles.userName}`}
              className="flex items-center gap-3 mt-4 mb-6 hover:text-primary transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={artwork.profiles.profileImage || ""}
                  alt={artwork.profiles.fullName || "Artist"}
                />
                <AvatarFallback>{getArtistInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{artwork.profiles.fullName}</p>
                <p className="text-sm text-muted-foreground">@{artwork.profiles.userName}</p>
              </div>
            </Link>

            <Separator className="my-6" />

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <span>{artwork.view_count} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 p-0 h-auto hover:bg-transparent"
                  onClick={handleLikeClick}
                  disabled={isLikeLoading}
                >
                  <Heart
                    className={cn("h-5 w-5", {
                      "fill-red-500 text-red-500": liked,
                      "text-muted-foreground": !liked,
                    })}
                  />
                </Button>
                <span>{likeCount} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{formatDate(artwork.created_at)}</span>
              </div>
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Category */}
            {artwork.category && (
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">{artwork.category}</Badge>
              </div>
            )}

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 