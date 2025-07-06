"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" attribute="class">
        <div className="text-gray-700 dark:text-gray-200 dark:bg-gray-700 min-h-screen select-none transition-colors duration-300">
          {children}
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
