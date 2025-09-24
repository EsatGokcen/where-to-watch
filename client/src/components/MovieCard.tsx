import { Link } from "react-router-dom";
import type { SearchResult } from "../types";

export default function MovieCard({ m }: { m: SearchResult }) {
  return (
    <Link to={`/${m.mediaType}/${m.id}`} className="group relative block">
      <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
        {m.posterUrl ? (
          <img
            src={m.posterUrl}
            alt={m.title}
            className="w-full aspect-[2/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[2/3] grid place-items-center text-slate-500">
            No Image
          </div>
        )}
      </div>

      {/* tiny badge to show type */}
      <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wide bg-black/60 backdrop-blur px-2 py-1 rounded-md border border-white/10">
        {m.mediaType}
      </span>

      <div className="mt-2 text-sm text-slate-200 group-hover:underline">
        {m.title}{" "}
        {m.year ? <span className="text-slate-400">({m.year})</span> : null}
      </div>
    </Link>
  );
}
