import { tmdb } from "../lib/http";
import { memoize } from "../lib/cache";

export type TmdbConfiguration = {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
};

export async function getConfiguration(): Promise<TmdbConfiguration> {
  return memoize(
    "tmdb:configuration",
    async () => {
      const { data } = await tmdb.get<TmdbConfiguration>("/configuration");
      return data;
    },
    24 * 60 * 60 * 1000
  );
}

export async function searchMovies(query: string, region?: string) {
  const { data } = await tmdb.get("/search/movie", {
    params: {
      query,
      include_adult: false,
      region,
    },
  });
  return data;
}

export async function getMovieDetails(id: string | number, _region?: string) {
  // region can affect release dates; not strictly needed for details here
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: {
      append_to_response: "credits,images",
      include_image_language: "en,null",
    },
  });
  return data;
}

export async function getWatchProviders(id: string | number) {
  const { data } = await tmdb.get(`/movie/${id}/watch/providers`);
  return data;
}

export async function searchMulti(query: string, region?: string) {
  const { data } = await tmdb.get("/search/multi", {
    params: { query, include_adult: false, region },
  });
  return data;
}

export async function searchTV(query: string, region?: string) {
  const { data } = await tmdb.get("/search/tv", {
    params: { query, include_adult: false, region },
  });
  return data;
}

export async function getTVDetails(id: string | number) {
  const { data } = await tmdb.get(`/tv/${id}`, {
    params: {
      append_to_response: "credits,images",
      include_image_language: "en,null",
    },
  });
  return data;
}

export async function getTVWatchProviders(id: string | number) {
  const { data } = await tmdb.get(`/tv/${id}/watch/providers`);
  return data;
}

export async function getWatchProviderRegions() {
  const { data } = await tmdb.get("/watch/providers/regions");
  return data;
}
