"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@/components/auth/google-button";
import { PhoneLogin } from "@/components/auth/phone-login";
import { EmailLogin } from "@/components/auth/email-login";
import { Smartphone, Mail } from "lucide-react";

type AuthMethod = "choice" | "phone" | "email";

export default function SignUpPage() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>("choice");

  const createSession = useCallback(
    async (idToken: string) => {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("Session creation failed");
      // New users go to business registration
      router.push("/setup");
      router.refresh();
    },
    [router]
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started with Rookies for free
        </p>
      </div>

      {method === "choice" && (
        <div className="space-y-3">
          {/* Google — Primary */}
          <GoogleButton
            onSuccess={createSession}
            label="Continue with Google"
          />

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
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
