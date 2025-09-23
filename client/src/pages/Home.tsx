import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { apiSearch } from "../api";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const region = useMemo(() => localStorage.getItem("region") || "GB", []);

  const { data, isFetching } = useQuery({
    queryKey: ["search", query, region],
    queryFn: () => (query ? apiSearch(query, region) : Promise.resolve([])),
    staleTime: 2 * 60 * 1000,
  });

  const onSearch = useCallback((q: string) => setQuery(q), []);

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <SearchBar onSearch={onSearch} />
      </div>

      {isFetching && <div className="mt-6 text-slate-400">Searching…</div>}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.map((m) => (
          <MovieCard key={m.id} m={m} />
        ))}
      </div>

      {!isFetching && query && data?.length === 0 && (
        <div className="mt-6 text-slate-400">No results.</div>
      )}
    </div>
  );
}
