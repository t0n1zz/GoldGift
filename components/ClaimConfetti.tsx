"use client";

import { useEffect, useState } from "react";

const COLORS = ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"];
const COUNT = 40;

export function ClaimConfetti() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {Array.from({ length: COUNT }).map((_, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 rounded-sm animate-claim-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 1.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}
