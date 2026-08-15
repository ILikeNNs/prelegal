"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/authApi";
import { useAuth } from "@/lib/AuthProvider";

export default function Header() {
  const router = useRouter();
  const { user, isLoading, setUser } = useAuth();

  async function handleSignOut() {
    await signOut();
    setUser(null);
    router.push("/signin");
  }

  return (
    <header className="no-print bg-brand-navy px-6 py-4 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Legal Document Creator
        </Link>

        {!isLoading && user && (
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/" className="hover:text-brand-yellow">
              Chat
            </Link>
            <Link href="/history" className="hover:text-brand-yellow">
              History
            </Link>
            <span className="text-gray-300">{user.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md bg-brand-purple px-3 py-1.5 font-medium hover:opacity-90"
            >
              Sign out
            </button>
          </nav>
        )}

        {!isLoading && !user && (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/signin" className="hover:text-brand-yellow">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-brand-purple px-3 py-1.5 font-medium hover:opacity-90"
            >
              Sign up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
