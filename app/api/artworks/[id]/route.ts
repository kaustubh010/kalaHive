import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET handler for fetching a single artwork by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artworkId = params.id;
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { artist: true },
    });

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    // Replicating the shaping logic from getArtworkById
    const responseArtwork = {
      ...artwork,
      profiles: {
        fullName: artwork.artist.name || "Unknown",
        image: artwork.artist.image || null,
      },
    };

    return NextResponse.json(responseArtwork);
  } catch (error) {
    console.error(`Error fetching artwork ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT handler for updating an artwork by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artworkId = params.id;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    });

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    if (artwork.artistId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, imageUrl, thumbnailUrl, category, tags, isFeatured } =
      body;

    const updatedArtwork = await prisma.artwork.update({
      where: { id: artworkId },
      data: {
        title,
        description,
        imageUrl,
        thumbnailUrl,
        category,
        tags,
        isFeatured,
      },
    });

    return NextResponse.json(updatedArtwork);
  } catch (error) {
    console.error(`Error updating artwork ${params.id}:`, error);
    // Check for specific Prisma error for record not found
    // Note: P2025 (Record not found) might be caught by the initial findUnique,
    // but it's good to keep for other potential update issues.
    if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Artwork not found during update" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting an artwork by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artworkId = params.id;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    });

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    if (artwork.artistId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.artwork.delete({
      where: { id: artworkId },
    });

    return NextResponse.json(
      { message: "Artwork deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting artwork ${params.id}:`, error);
    // Note: P2025 (Record not found) might be caught by the initial findUnique.
    if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Artwork not found during delete" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
