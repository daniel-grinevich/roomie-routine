// app/components/Navbar.tsx
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import Links from './links/Links'

export default async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex items-center h-[80px] flex-row gap-4 py-4">
      <div id="logo">
        <h1>Roomie Routine</h1>
      </div>
      <div>
        <Links />
      </div>
      <div className="flex-end flex flex-row gap-1">
        {session ? (
          // User is authenticated
          <div className="flex flex-row gap-1">
            <Link href="/api/auth/signout">
              <button className="bg-black text-white p-2">Sign Out</button>
            </Link>
          </div>
        ) : (
          // User is not authenticated
          <Link href="/api/auth/signin">
            <button className="bg-black text-white p-2">Sign In</button>
          </Link>
        )}
      </div>
    </nav>
  );
}