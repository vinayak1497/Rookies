"use client";

import { Suspense, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleButton } from "@/components/auth/google-button";
import { PhoneLogin } from "@/components/auth/phone-login";
import { EmailLogin } from "@/components/auth/email-login";
import { Smartphone, Mail } from "lucide-react";

type AuthMethod = "choice" | "phone" | "email";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [method, setMethod] = useState<AuthMethod>("choice");

  const createSession = useCallback(
    async (idToken: string) => {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("Session creation failed");
      router.push(next);
      router.refresh();
    },
    [router, next]
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome to Rookies
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your account
        </p>
      </div>

      {method === "choice" && (
        <div className="space-y-3">
          {/* Google — Primary */}
          <GoogleButton onSuccess={createSession} />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Phone */}
          <button
            onClick={() => setMethod("phone")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
          >
            <Smartphone className="h-4 w-4" />
            Continue with Phone
          </button>

          {/* Email */}
          <button
            onClick={() => setMethod("email")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
          >
            <Mail className="h-4 w-4" />
            Continue with Email
          </button>
        </div>
      )}

      {method === "phone" && (
        <div>
          <PhoneLogin onSuccess={createSession} />
          <button
            type="button"
            onClick={() => setMethod("choice")}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to all options
          </button>
        </div>
      )}

      {method === "email" && (
        <div>
          <EmailLogin onSuccess={createSession} />
          <button
            type="button"
            onClick={() => setMethod("choice")}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to all options
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-6" />
          <div className="space-y-3">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
