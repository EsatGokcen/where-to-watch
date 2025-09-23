import axios from "axios";
import type { SearchResult, MovieDetails, Providers } from "./types";


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const DEFAULT_REGION = (import.meta.env.VITE_DEFAULT_REGION || "GB").toUpperCase();


export async function apiSearch(query: string, region = DEFAULT_REGION) {
const { data } = await axios.get<{ results: SearchResult[] }>(`${API_BASE}/api/v1/search`, {
params: { query, region },
});
return data.results;
}


export async function apiMovie(id: number) {
const { data } = await axios.get<MovieDetails>(`${API_BASE}/api/v1/movies/${id}`);
return data;
}


export async function apiProviders(id: number, region = DEFAULT_REGION) {
const { data } = await axios.get<{ id: number; region: string; availability: Providers }>(
`${API_BASE}/api/v1/movies/${id}/providers`,
{ params: { region } }
);
return data.availability;
}


export async function apiConfig() {
const { data } = await axios.get<{ images: any; attribution: string; supportedRegions: string[] }>(
`${API_BASE}/api/v1/config`
);
return data;
}