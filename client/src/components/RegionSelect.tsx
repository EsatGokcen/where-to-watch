import { useEffect, useRef, useState } from "react";
import { apiConfig } from "../api";

type RegionOption = { code: string; label: string; emoji: string };

/** Fallback: build a flag emoji from ISO2 (e.g. "GB" → 🇬🇧) */
function codeToFlagEmoji(code: string) {
  const A = 0x1f1e6;
  return code
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2)
    .split("")
    .map((c) => String.fromCodePoint(A + c.charCodeAt(0) - 65))
    .join("");
}

const LABELS: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  TR: "Türkiye",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  IN: "India",
  BR: "Brazil",
  JP: "Japan",
};

const EMOJIS: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  TR: "🇹🇷",
  CA: "🇨🇦",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  ES: "🇪🇸",
  IT: "🇮🇹",
  IN: "🇮🇳",
  BR: "🇧🇷",
  JP: "🇯🇵",
};

export default function RegionSelect() {
  const [regions, setRegions] = useState<string[]>(["GB"]);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const initial = (
    localStorage.getItem("region") ||
    import.meta.env.VITE_DEFAULT_REGION ||
    "GB"
  ).toUpperCase();

  const [value, setValue] = useState<string>(initial);

  // Load supported regions from backend
  useEffect(() => {
    apiConfig().then((cfg) => {
      if (Array.isArray(cfg.supportedRegions) && cfg.supportedRegions.length) {
        setRegions(cfg.supportedRegions.map((r: string) => r.toUpperCase()));
      }
    });
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem("region", value.toUpperCase());
  }, [value]);

  // Close on outside click / ESC
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(t) &&
        triggerRef.current &&
        !triggerRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options: RegionOption[] = regions.map((code) => ({
    code,
    label: LABELS[code] || code,
    emoji: EMOJIS[code] || codeToFlagEmoji(code),
  }));

  const current = options.find((o) => o.code === value.toUpperCase()) || {
    code: value.toUpperCase(),
    label: LABELS[value] || value.toUpperCase(),
    emoji: EMOJIS[value] || codeToFlagEmoji(value),
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="
          inline-flex items-center gap-2 rounded-xl
          border border-slate-700/70 bg-slate-900/70
          px-3 py-2 text-sm leading-none shadow-sm
          hover:bg-slate-800/70 hover:border-slate-600
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60
          transition-colors"
      >
        <span className="text-lg">{current.emoji}</span>
        <span className="font-medium tracking-wide">{current.code}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          className={`ml-1 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path
            d="M5.5 7.5l4.5 4 4.5-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Popover */}
      <div
        ref={popoverRef}
        role="menu"
        className={`
          absolute right-0 mt-2 w-56 origin-top-right
          rounded-xl border border-slate-700/70 bg-slate-900/95 backdrop-blur
          shadow-xl ring-1 ring-black/5
          transition ease-out duration-150
          ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        <ul className="py-2">
          {options.map((o) => {
            const selected = o.code === current.code;
            return (
              <li key={o.code}>
                <button
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => {
                    setValue(o.code);
                    setOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2.5 text-left text-sm flex items-center gap-3
                    hover:bg-slate-800/70
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60
                    transition
                    ${selected ? "bg-slate-800/60" : ""}
                  `}
                >
                  <span className="text-lg">{o.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">{o.code}</div>
                    <div className="text-xs text-slate-400">{o.label}</div>
                  </div>
                  {selected ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      className="text-sky-400"
                      aria-hidden
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
