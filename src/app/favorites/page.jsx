import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Card from "@/components/Card";

export const metadata = {
  title: "My Favorites",
  description: "List of your favorited movies",
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700">
          Please <a href="/auth/signin" className="text-blue-500 underline">log in</a> to view your favorites.
        </p>
      </div>
    );
  }

  // Fetch user's favorite movies from DB
  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700">You haven’t added any favorites yet.</p>
      </div>
    );
  }

  // Fetch full movie details from TMDB API
  const movieDetails = await Promise.all(
    favorites.map(async (fav) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${fav.movieId}?api_key=${process.env.API_KEY}&language=en-US`
      );
      return res.ok ? await res.json() : null;
    })
  );

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movieDetails
          .filter((movie) => movie !== null) // Skip failed API calls
          .map((movie) => (
            <Card key={movie.id} result={movie} />
          ))}
      </div>
    </div>
  );
}
