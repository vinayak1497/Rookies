"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "rookies_seen_intro";

export function RookiesSplash({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the user has already seen the intro this session
    const hasSeen = sessionStorage.getItem(STORAGE_KEY);
    if (hasSeen === "true") {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setShowSplash(false);
  };

  // SSR: render nothing until hydrated to avoid layout shift
  if (showSplash === null) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#0f1623",
        }}
      />
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashOverlay onComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>

      {/* Page content — always mounted for SSR, hidden during splash */}
      <motion.div
        initial={{ opacity: showSplash ? 0 : 1 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.div>
    </>
  );
}

/* ──────────────────────────────────────────────
 * Splash Overlay — the animated full-screen intro
 * ────────────────────────────────────────────── */

function SplashOverlay({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "#0f1623" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={(definition) => {
        // Only fire on exit animation
        if (
          typeof definition === "object" &&
          definition !== null &&
          "opacity" in definition &&
          (definition as { opacity: number }).opacity === 0
        ) {
          onComplete();
        }
      }}
    >
      {/* Soft ambient glow behind logo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          background:
            "radial-gradient(circle, rgba(236,91,19,0.12) 0%, rgba(236,91,19,0.04) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      {/* Central content group */}
      <div className="relative flex flex-col items-center gap-5">
        {/* Logo */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.88, y: 8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{ opacity: 0, scale: 1.02, y: -4 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1], // custom cubic-bezier for premium feel
            delay: 0.2,
          }}
        >
          {/* Subtle halo ring behind the image */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(245,230,224,0.06) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          <Image
            src="/Rookies_Logo.jpeg"
            alt="Rookies Logo"
            width={160}
            height={160}
            priority
            className="relative rounded-2xl"
            style={{
              filter: "drop-shadow(0 4px 24px rgba(236,91,19,0.15))",
            }}
          />
        </motion.div>

        {/* Tagline text */}
        <motion.p
          className="text-sm tracking-[0.3em] uppercase font-medium"
          style={{ color: "rgba(245,230,224,0.5)" }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
            delay: 0.7,
          }}
        >
          Your Virtual COO
        </motion.p>
      </div>

      {/* Auto-trigger exit after animation completes */}
      <SplashTimer onDone={onComplete} />
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 * SplashTimer — triggers onDone after the full sequence
 * ────────────────────────────────────────────── */
function SplashTimer({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 2400); // Total animation: ~2.4s then fade out

    return () => clearTimeout(timer);
  }, [onDone]);

  return null;
}
