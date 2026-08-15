"use client";

import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/authApi";
import { useRedirectIfAuthed } from "@/lib/useRequireAuth";

export default function SignUpPage() {
  useRedirectIfAuthed();

  return (
    <main className="flex-1 bg-gray-50 px-6 py-8">
      <AuthForm mode="signup" onSubmit={signUp} />
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/signin" className="text-brand-blue hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
