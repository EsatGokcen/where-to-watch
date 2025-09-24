import { getConfiguration } from "./tmdb";

type ImageKind = "poster" | "backdrop" | "logo";

function pickSize(kind: ImageKind): string {
  switch (kind) {
    case "poster":
      return "w342"; // grid
    case "backdrop":
      return "w780"; // detail header
    case "logo":
      return "w45"; // provider chips
  }
}

export async function imageUrl(
  path: string | null | undefined,
  kind: ImageKind
): Promise<string | null> {
  if (!path) return null;
  const cfg = await getConfiguration();
  const base = cfg.images.secure_base_url || "https://image.tmdb.org/t/p/";
  const size = pickSize(kind);
  return `${base}${size}${path}`;
}

export function yearFrom(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const y = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

export async function mapSearchResult(r: any) {
  return {
    id: r.id,
    title: r.title,
    year: yearFrom(r.release_date),
    posterUrl: await imageUrl(r.poster_path, "poster"),
    backdropUrl: await imageUrl(r.backdrop_path, "backdrop"),
    tmdbRating: r.vote_average ?? null,
  };
}

export async function mapDetails(d: any) {
  return {
    id: d.id,
    title: d.title,
    year: yearFrom(d.release_date),
    runtime: d.runtime ?? null,
    overview: d.overview ?? "",
    genres: Array.isArray(d.genres) ? d.genres.map((g: any) => g.name) : [],
    posterUrl: await imageUrl(d.poster_path, "poster"),
    backdropUrl: await imageUrl(d.backdrop_path, "backdrop"),
    cast: Array.isArray(d.credits?.cast)
      ? d.credits.cast.slice(0, 8).map((c: any) => ({
          name: c.name,
          role: c.character,
        }))
      : [],
    crew: Array.isArray(d.credits?.crew)
      ? d.credits.crew
          .filter((c: any) => c.job === "Director")
          .slice(0, 3)
          .map((c: any) => ({ name: c.name, job: c.job }))
      : [],
    tmdbRating: d.vote_average ?? null,
  };
}

export async function mapProviders(providersResp: any, region: string) {
  const regionData = providersResp?.results?.[region];
  const link = regionData?.link ?? null;

  const join = async (arr?: any[]) =>
    arr
      ? Promise.all(
          arr.map(async (p) => ({
            providerId: p.provider_id,
            name: p.provider_name,
            logoUrl: await imageUrl(p.logo_path, "logo"),
            link,
          }))
        )
      : [];

  const free = await join(regionData?.free);
  const ads = await join(regionData?.ads);
  const flatrate = await join(regionData?.flatrate);
  const rent = await join(regionData?.rent);
  const buy = await join(regionData?.buy);

  return {
    link,
    free_ads: [...free, ...ads],
    subscription: flatrate,
    rent,
    buy,
  };
}

export async function mapSearchResultAny(r: any) {
  const mediaType =
    r.media_type === "tv" || r.media_type === "movie"
      ? r.media_type
      : r.name
      ? "tv"
      : "movie";
  const title =
    mediaType === "tv"
      ? r.name ?? r.original_name
      : r.title ?? r.original_title;
  const date = mediaType === "tv" ? r.first_air_date : r.release_date;
  return {
    id: r.id,
    mediaType, // <-- NEW
    title,
    year: yearFrom(date),
    posterUrl: await imageUrl(r.poster_path, "poster"),
    backdropUrl: await imageUrl(r.backdrop_path, "backdrop"),
    tmdbRating: r.vote_average ?? null,
  };
}

export async function mapTVDetails(d: any) {
  const runtime =
    Array.isArray(d.episode_run_time) && d.episode_run_time.length
      ? d.episode_run_time[0]
      : null;
  return {
    id: d.id,
    title: d.name ?? d.original_name,
    year: yearFrom(d.first_air_date),
    runtime,
    overview: d.overview ?? "",
    genres: Array.isArray(d.genres) ? d.genres.map((g: any) => g.name) : [],
    posterUrl: await imageUrl(d.poster_path, "poster"),
    backdropUrl: await imageUrl(d.backdrop_path, "backdrop"),
    cast: Array.isArray(d.credits?.cast)
      ? d.credits.cast
          .slice(0, 8)
          .map((c: any) => ({ name: c.name, role: c.character }))
      : [],
    crew: Array.isArray(d.credits?.crew)
      ? d.credits.crew
          .filter(
            (c: any) =>
              c.job === "Director" ||
              c.job === "Series Director" ||
              c.department === "Directing"
          )
          .slice(0, 3)
          .map((c: any) => ({ name: c.name, job: c.job }))
      : [],
    tmdbRating: d.vote_average ?? null,
  };
}
