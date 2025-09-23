import { useEffect, useMemo, useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const [q, setQ] = useState("");

  // debounce 300ms
  const debounced = useMemo(() => {
    let t: any;
    return (val: string) => {
      clearTimeout(t);
      t = setTimeout(() => onSearch(val.trim()), 300);
    };
  }, [onSearch]);

  useEffect(() => {
    debounced(q);
  }, [q, debounced]);

  return (
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Search for a movie..."
      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500"
    />
  );
}
