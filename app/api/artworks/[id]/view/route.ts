import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST handler for recording an artwork view
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artworkId = params.id;
    const body = await req.json().catch(() => ({})); // Allow empty body or non-JSON body
    const { userId } = body; // userId is optional

    await prisma.artworkView.create({
      data: { userId: userId || null, artworkId }, // Handle optional userId
    });

    const updatedArtwork = await prisma.artwork.update({
      where: { id: artworkId },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      message: "View recorded",
      viewCount: updatedArtwork.viewCount,
    });
  } catch (error) {
    console.error(`Error recording view for artwork ${params.id}:`, error);
    if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
