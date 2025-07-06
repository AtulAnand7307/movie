import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import Results from "@/components/Results";
import Pagination from "@/components/Pagination";

const API_KEY = process.env.API_KEY;

export default async function Home({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect to login page if user is not authenticated
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">You must be logged in</h1>
          <a
            href="/auth/signin"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  const genre = searchParams.genre || "fetchTrending";
  const page = parseInt(searchParams.page) || 1;

  const res = await fetch(
    `https://api.themoviedb.org/3${
      genre === "fetchTopRated" ? `/movie/top_rated` : `/trending/all/week`
    }?api_key=${API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 10000 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return (
    <div>
      <Results results={data.results} />
      <Pagination
        currentPage={page}
        totalPages={data.total_pages}
        genre={genre}
      />
    </div>
  );
}
