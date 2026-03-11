"use client";

import { useState, useRef, useEffect } from "react";
import {
  setupRecaptcha,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "@/lib/firebase-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

interface PhoneLoginProps {
  onSuccess: (idToken: string) => Promise<void>;
}

export function PhoneLogin({ onSuccess }: PhoneLoginProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      // Clean up reCAPTCHA on unmount
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  function formatPhoneNumber(input: string): string {
    const digits = input.replace(/\D/g, "");
    // If user enters 10-digit Indian number, prepend +91
    if (digits.length === 10) return `+91${digits}`;
    // If already has country code
    if (input.startsWith("+")) return input;
    return `+${digits}`;
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formatted = formatPhoneNumber(phone);
      if (formatted.length < 12) {
        setError("Please enter a valid phone number.");
        setIsLoading(false);
        return;
      }

      // Initialize reCAPTCHA if not already done
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupRecaptcha("recaptcha-container");
      }

      const result = await sendPhoneOtp(formatted, recaptchaRef.current);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "";
      if (message.includes("invalid-phone-number")) {
        setError("Please enter a valid phone number.");
      } else if (message.includes("too-many-requests")) {
        setError("Too many attempts. Please wait a moment and try again.");
      } else {
        setError("That didn\u2019t work. Please try again.");
      }
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmationResult) return;

    setIsLoading(true);
    setError(null);

    try {
      const user = await verifyPhoneOtp(confirmationResult, otp);
      const idToken = await user.getIdToken();
      await onSuccess(idToken);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "";
      if (message.includes("invalid-verification-code")) {
        setError("Incorrect code. Please check and try again.");
      } else if (message.includes("code-expired")) {
        setError("Code expired. Please request a new one.");
        setStep("phone");
      } else {
        setError("That didn\u2019t work. Please try again.");
      }
      setIsLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-foreground"
          >
            Enter verification code
          </label>
          <p className="text-xs text-muted-foreground">
            Sent to {formatPhoneNumber(phone)}
          </p>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length < 6}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setOtp("");
            setError(null);
          }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground"
        >
          Phone number
        </label>
        <div className="flex gap-2">
          <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-input bg-muted text-sm text-muted-foreground">
            +91
          </div>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? "Sending code..." : "Send OTP"}
      </Button>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container" />
    </form>
  );
}
