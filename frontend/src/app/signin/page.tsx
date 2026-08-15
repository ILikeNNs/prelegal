"use client";

import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { signIn } from "@/lib/authApi";
import { useRedirectIfAuthed } from "@/lib/useRequireAuth";

export default function SignInPage() {
  useRedirectIfAuthed();

  return (
    <main className="flex-1 bg-gray-50 px-6 py-8">
      <AuthForm mode="signin" onSubmit={signIn} />
      <p className="mt-4 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-blue hover:underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
