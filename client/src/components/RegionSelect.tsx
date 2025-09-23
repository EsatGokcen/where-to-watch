import { useEffect, useState } from "react";
import { apiConfig } from "../api";

export default function RegionSelect() {
  const [regions, setRegions] = useState<string[]>(["GB"]);
  const [value, setValue] = useState<string>(
    localStorage.getItem("region") ||
      import.meta.env.VITE_DEFAULT_REGION ||
      "GB"
  );

  useEffect(() => {
    apiConfig().then((cfg) => setRegions(cfg.supportedRegions));
  }, []);

  useEffect(() => {
    localStorage.setItem("region", value);
  }, [value]);

  return (
    <select
      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
      value={value}
      onChange={(e) => setValue(e.target.value.toUpperCase())}
    >
      {regions.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}
