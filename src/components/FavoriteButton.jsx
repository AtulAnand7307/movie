"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FavoriteButton({ movie }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if movie is already in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!session) return;

      try {
        const res = await fetch("/api/favorites");
        const favorites = await res.json();
        const exists = favorites.some((fav) => fav.movieId === movie.id);
        setIsFavorite(exists);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };

    checkFavorite();
  }, [session, movie.id]);

  const toggleFavorite = async () => {
    if (!session) {
      alert("Please log in to manage favorites.");
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        // Remove favorite
        const res = await fetch(`/api/favorites?movieId=${movie.id}`, {
          method: "DELETE",
        });
        if (res.ok) setIsFavorite(false);
      } else {
        // Add favorite
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId: movie.id }),
        });
        if (res.ok) setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm ${
        isFavorite ? "bg-red-500 text-white" : "bg-blue-500 text-white"
      }`}
    >
      {loading ? "Processing..." : isFavorite ? "★ Favorited" : "☆ Favorite"}
    </button>
  );
}
