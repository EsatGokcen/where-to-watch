export type SearchResult = {
id: number;
title: string;
year: number | null;
posterUrl: string | null;
backdropUrl: string | null;
tmdbRating: number | null;
};


export type MovieDetails = {
id: number;
title: string;
year: number | null;
runtime: number | null;
overview: string;
genres: string[];
posterUrl: string | null;
backdropUrl: string | null;
cast: { name: string; role: string }[];
crew: { name: string; job: string }[];
tmdbRating: number | null;
};


export type Providers = {
link: string | null;
free_ads: ProviderItem[];
subscription: ProviderItem[];
rent: ProviderItem[];
buy: ProviderItem[];
};


export type ProviderItem = {
providerId: number;
name: string;
logoUrl: string | null;
link: string | null;
};