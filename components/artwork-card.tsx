"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toggleArtworkLike, hasUserLikedArtwork } from "@/utils/artwork";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ArtworkWithArtist } from "@/utils/artwork";

interface ArtworkCardProps {
  artwork: ArtworkWithArtist;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(artwork.like_count);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Check if the user has liked this artwork
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user) {
        const { liked } = await hasUserLikedArtwork(artwork.id);
        setLiked(liked);
      }
    };
    checkLikeStatus();
  }, [artwork.id, user]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    if (isLikeLoading) return;

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

  // Get artist initials for avatar fallback
  const getArtistInitials = () => {
    if (artwork.profiles.fullName) {
      return artwork.profiles.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return "KH"; // Kala Hive default
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/artist/${artwork.profiles.userName}`);
  };

  const handleArtworkClick = () => {
    router.push(`/artwork/${artwork.id}`);
  };

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={handleArtworkClick}>
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{artwork.title}</h3>
        {artwork.description && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {artwork.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 group cursor-pointer" 
          onClick={handleArtistClick}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={artwork.profiles.profileImage || ""}
              alt={artwork.profiles.fullName || "Artist"}
            />
            <AvatarFallback className="text-xs">
              {getArtistInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
            {artwork.profiles.fullName || artwork.profiles.userName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-xs">{artwork.view_count}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleLikeClick}
            disabled={isLikeLoading}
          >
            <Heart
              className={cn("h-4 w-4", {
                "fill-red-500 text-red-500": liked,
                "text-muted-foreground": !liked,
              })}
            />
            <span className="sr-only">Like</span>
          </Button>
          <span className="text-xs text-muted-foreground">{likeCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
} 