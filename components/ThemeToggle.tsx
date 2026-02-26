"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = theme ?? resolvedTheme ?? "system";

  return (
    <div className="inline-flex items-center rounded-full border border-stone-200 bg-white/80 text-xs">
      {options.map(({ value, label, icon: Icon }) => {
        const active = current === value || (value === "system" && theme === undefined);
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={[
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors",
              active
                ? "bg-stone-900 text-stone-50"
                : "text-stone-600 hover:bg-stone-100",
            ].join(" ")}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

