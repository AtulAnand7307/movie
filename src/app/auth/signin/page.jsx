"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          🎬 Welcome to IMDb Clone
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Please log in to continue
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
