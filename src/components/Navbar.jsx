'use client';

import NavbarItem from "./NavbarItem";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-wrap items-center justify-between dark:bg-gray-600 bg-amber-100 p-4 lg:text-lg">
      {/* Left: Navigation Links */}
      <div className="flex justify-center gap-6">
        <NavbarItem title="Trending" param="fetchTrending" />
        <NavbarItem title="Top Rated" param="fetchTopRated" />
        {session && (
          <NavbarItem title="My Favorites" href="/favorites" />
        )}
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="hidden sm:inline">Hello, {session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}