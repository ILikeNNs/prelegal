"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

/** Redirects to /signin once we know for sure there's no signed-in user. */
export function useRequireAuth() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [isLoading, user, router]);

  return { user, isLoading };
}

/** For /signin and /signup: bounce an already-signed-in user back to the app. */
export function useRedirectIfAuthed() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);
}
