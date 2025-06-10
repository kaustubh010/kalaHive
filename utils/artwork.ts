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
