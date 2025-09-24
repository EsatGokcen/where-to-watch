import { createContext, useContext, useEffect, useState } from "react";

type RegionCtx = { region: string; setRegion: (r: string) => void };
const RegionContext = createContext<RegionCtx | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState(
    (
      localStorage.getItem("region") ||
      import.meta.env.VITE_DEFAULT_REGION ||
      "GB"
    ).toUpperCase()
  );

  useEffect(() => {
    localStorage.setItem("region", region);
  }, [region]);

  // keep tabs/windows in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "region" && e.newValue) setRegion(e.newValue.toUpperCase());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within RegionProvider");
  return ctx;
}
