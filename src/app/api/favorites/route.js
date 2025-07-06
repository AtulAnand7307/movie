import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// ✅ GET all favorites for current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(favorites), { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching favorites" }),
      { status: 500 }
    );
  }
}

// ✅ POST add new favorite
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { movieId } = await request.json();

  if (!movieId) {
    return new Response(JSON.stringify({ message: "movieId is required" }), {
      status: 400,
    });
  }

  try {
    // Check if already favorited
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        movieId: parseInt(movieId),
      },
    });

    if (existingFavorite) {
      return new Response(
        JSON.stringify({ message: "Movie already in favorites" }),
        { status: 409 } // Conflict
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        movieId: parseInt(movieId),
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify(favorite), { status: 201 });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return new Response(
      JSON.stringify({ message: "Error adding favorite" }),
      { status: 500 }
    );
  }
}

// ✅ DELETE remove favorite (expects movieId in query param ?movieId=123)
export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return new Response(JSON.stringify({ message: "movieId is required" }), {
      status: 400,
    });
  }

  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        movieId: parseInt(movieId),
      },
    });

    return new Response(
      JSON.stringify({ message: "Removed from favorites" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing favorite:", error);
    return new Response(
      JSON.stringify({ message: "Error removing favorite" }),
      { status: 500 }
    );
  }
}
