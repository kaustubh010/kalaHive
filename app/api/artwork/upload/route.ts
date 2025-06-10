import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadArtworkImage } from "@/utils/artwork";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const tagsRaw = formData.get("tags") as string;

    if (!file || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const imageUrl = await uploadArtworkImage(buffer, "artworks");

    // Parse tags
    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Save artwork in DB
    const artwork = await prisma.artwork.create({
      data: {
        artistId: session.user.id,
        title,
        description: description || "",
        imageUrl,
        thumbnailUrl: imageUrl, // Using imageUrl as thumbnail by default
        category,
        tags,
        // isFeatured will default to false as per schema, if not provided
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
