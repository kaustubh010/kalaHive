import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST handler for creating a new artwork
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const artistId = session.user.id;

    const body = await req.json();
    const {
      // artistId, // Removed from body, will use from session
      title,
      description,
      imageUrl,
      thumbnailUrl,
      category,
      tags,
      isFeatured,
    } = body;

    if (!title || !imageUrl) { // artistId is now from session
      return NextResponse.json(
        { error: "Missing required fields: title, imageUrl" },
        { status: 400 }
      );
    }

    const artwork = await prisma.artwork.create({
      data: {
        artistId, // From session
        title,
        description: description || "",
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        category,
        tags: tags?.length ? tags : [],
        isFeatured: isFeatured || false,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET handler for fetching all artworks
export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: "desc" },
      include: { artist: true },
    });
    return NextResponse.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
