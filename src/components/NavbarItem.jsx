'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NavbarItem({ title, param, href }) {
  const searchParams = useSearchParams();
  const genre = searchParams.get('genre');
  
  // For non-param links (like favorites)
  if (!param) {
    return (
      <div>
        <Link
          className="hover:text-amber-600 font-semibold"
          href={href}
        >
          {title}
        </Link>
      </div>
    );
  }

  // For genre param links
  return (
    <div>
      <Link
        className={`hover:text-amber-600 font-semibold ${
          genre === param
            ? 'underline underline-offset-8 decoration-4 decoration-amber-500 rounded-lg'
            : ''
        }`}
        href={`/?genre=${param}`}
      >
        {title}
      </Link>
    </div>
  );
}