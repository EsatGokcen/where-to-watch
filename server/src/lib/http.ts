import axios from "axios";
import { env } from "../config/env";

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: env.TMDB_API_KEY },
  timeout: 15_000,
});
