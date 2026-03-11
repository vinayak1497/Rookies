"use client";

import { useState, useEffect } from "react";
import {
  sendEmailSignInLink,
  isEmailSignInLink,
  completeEmailSignIn,
} from "@/lib/firebase-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

interface EmailLoginProps {
  onSuccess: (idToken: string) => Promise<void>;
}

export function EmailLogin({ onSuccess }: EmailLoginProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle email link callback on mount
  useEffect(() => {
    async function handleEmailCallback() {
      if (isEmailSignInLink(window.location.href)) {
        const storedEmail = window.localStorage.getItem(
          "rookies_email_for_sign_in"
        );
        if (!storedEmail) {
          setError("Please enter your email to complete sign-in.");
          return;
        }
        try {
          const user = await completeEmailSignIn(
            storedEmail,
            window.location.href
          );
          const idToken = await user.getIdToken();
          await onSuccess(idToken);
        } catch {
          setError("Email link expired or invalid. Please try again.");
        }
      }
    }
    handleEmailCallback();
  }, [onSuccess]);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendEmailSignInLink(email);
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("invalid-email")) {
        setError("Please enter a valid email address.");
      } else {
        setError("That didn\u2019t work. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-foreground">Check your email</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a sign-in link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendLink} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="pl-10"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "Sending link..." : "Send Sign-In Link"}
      </Button>
    </form>
  );
}
