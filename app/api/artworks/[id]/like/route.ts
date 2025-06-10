import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST handler for toggling a like on an artwork
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artworkId = params.id;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // const body = await req.json(); // No longer needed if userId is from session
    // const { userId } = body; // userId is from session

    // if (!userId) { // This check is now covered by session check
    //   return NextResponse.json(
    //     { error: "Missing required field: userId" },
    //     { status: 400 }
    //   );
    // }

    const existingLike = await prisma.artworkLike.findUnique({
      where: { userId_artworkId: { userId, artworkId } },
    });

    let liked;
    if (existingLike) {
      await prisma.artworkLike.delete({
        where: { id: existingLike.id },
      });
      await prisma.artwork.update({
        where: { id: artworkId },
        data: { likeCount: { decrement: 1 } },
      });
      liked = false;
    } else {
      await prisma.artworkLike.create({
        data: { userId, artworkId },
      });
      await prisma.artwork.update({
        where: { id: artworkId },
        data: { likeCount: { increment: 1 } },
      });
      liked = true;
    }

    return NextResponse.json({ liked });
  } catch (error) {
    console.error(`Error toggling like for artwork ${params.id}:`, error);
    if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET handler for checking if a user has liked an artwork
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artworkId = params.id;
    // Assuming userId is passed as a query parameter, e.g., /api/artworks/[id]/like?userId=...
    // Alternatively, it might come from session or request body if that's preferred.
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required query parameter: userId" },
        { status: 400 }
      );
    }

    const like = await prisma.artworkLike.findUnique({
      where: {
        userId_artworkId: {
          userId,
          artworkId,
        },
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error(
      `Error checking like status for artwork ${params.id}:`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
