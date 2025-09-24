import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiConfig } from "../api";
import { useRegion } from "../region";

type RegionOption = { code: string; label: string; emoji: string };

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

const MENU_WIDTH = 224; // Tailwind w-56
const MENU_GAP = 8;

export default function RegionSelect() {
  const { region, setRegion } = useRegion();
  const [regions, setRegions] = useState<string[]>(["US", "GB", "TR"]);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Load supported regions from backend (merge with defaults)
  useEffect(() => {
    apiConfig().then((cfg) => {
      const srv = Array.isArray(cfg.supportedRegions)
        ? cfg.supportedRegions
        : [];
      const merged = Array.from(
        new Set([...regions, ...srv.map((r: string) => r.toUpperCase())])
      ).sort();
      setRegions(merged);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updatePosition() {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.round(rect.right - MENU_WIDTH + window.scrollX);
    const top = Math.round(rect.bottom + MENU_GAP + window.scrollY);
    setPos({ top, left });
  }

  // Close on outside click, but ignore clicks inside the menu (portal)
  useEffect(() => {
    if (!open) return;
    updatePosition();

    const onPointerDown = (e: Event) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return; // click on trigger: let it toggle
      if (menuRef.current?.contains(t)) return; // click inside menu: allow item handler
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onReflow = () => updatePosition();

    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("touchstart", onPointerDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open]);

  const options: RegionOption[] = regions.map((code) => ({
    code,
    label: LABELS[code] || code,
    emoji: EMOJIS[code] || codeToFlagEmoji(code),
  }));

  const current = options.find((o) => o.code === region.toUpperCase()) || {
    code: region.toUpperCase(),
    label: LABELS[region] || region.toUpperCase(),
    emoji: EMOJIS[region] || codeToFlagEmoji(region),
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
        className="inline-flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm leading-none shadow-sm hover:bg-slate-800/70 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 transition-colors"
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

      {/* Portal menu (fixed, high z-index) */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
            className="fixed z-[9999] origin-top-right rounded-xl border border-slate-700/70 bg-slate-900/95 backdrop-blur shadow-xl ring-1 ring-black/5"
          >
            <ul className="py-2 max-h-[60vh] overflow-auto">
              {options.map((o) => {
                const selected = o.code === current.code;
                return (
                  <li key={o.code}>
                    <button
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => {
                        setRegion(o.code); // <-- will now fire before menu closes
                        setOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 transition ${
                        selected ? "bg-slate-800/60" : ""
                      }`}
                    >
                      <span className="text-lg">{o.emoji}</span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-200">
                          {o.code}
                        </div>
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
          </div>,
          document.body
        )}
    </div>
  );
}
