import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

// Upload image to Cloudinary
export async function uploadArtworkImage(fileBuffer: Buffer, folder = "artworks"): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uuidv4(),
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

// Create artwork entry in DB
export async function createArtworkEntry({
  artistId,
  title,
  description,
  imageUrl,
  thumbnailUrl,
  category,
  tags,
  isFeatured = false,
}: {
  artistId: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  isFeatured?: boolean;
}) {
  return await prisma.artwork.create({
    data: {
      artistId,
      title,
      description: description || "",
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      category,
      tags: tags?.length ? tags : [],
      isFeatured,
    },
  });
}

// Get all artworks
export async function getAllArtworks() {
  return await prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: { artist: true },
  });
}

// Get artwork by ID, shaped for your frontend
export async function getArtworkById(artworkId: string) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: { artist: true },
  });

  if (!artwork) return { artwork: null, error: new Error("Artwork not found") };

  return {
    artwork: {
      ...artwork,
      profiles: {
        fullName: artwork.artist.name || "Unknown",
        image: artwork.artist.image || null,
      },
    },
    error: null,
  };
}

// Record a view and increment counter
export async function recordView({
  userId,
  artworkId,
}: {
  userId?: string;
  artworkId: string;
}) {
  await prisma.artworkView.create({
    data: { userId, artworkId },
  });

  await prisma.artwork.update({
    where: { id: artworkId },
    data: { viewCount: { increment: 1 } },
  });
}

// Toggle like
export async function toggleArtworkLike({
  userId,
  artworkId,
}: {
  userId: string;
  artworkId: string;
}) {
  const existing = await prisma.artworkLike.findUnique({
    where: { userId_artworkId: { userId, artworkId } },
  });

  if (existing) {
    await prisma.artworkLike.delete({
      where: { id: existing.id },
    });

    await prisma.artwork.update({
      where: { id: artworkId },
      data: { likeCount: { decrement: 1 } },
    });

    return false;
  } else {
    await prisma.artworkLike.create({
      data: { userId, artworkId },
    });

    await prisma.artwork.update({
      where: { id: artworkId },
      data: { likeCount: { increment: 1 } },
    });

    return true;
  }
}

// Get all artworks by a user
export async function getArtworksByUser(userId: string) {
  return await prisma.artwork.findMany({
    where: { artistId: userId },
    orderBy: { createdAt: "desc" },
  });
}

// Get artworks liked by a user
export async function getLikedArtworks(userId: string) {
  const likes = await prisma.artworkLike.findMany({
    where: { userId },
    include: { artwork: true },
  });

  return likes.map((like) => like.artwork);
}

// Check if user has liked artwork
export async function hasUserLikedArtwork(artworkId: string, userId: string) {
  const like = await prisma.artworkLike.findUnique({
    where: {
      userId_artworkId: {
        userId,
        artworkId,
      },
    },
  });

  return { liked: !!like };
}
