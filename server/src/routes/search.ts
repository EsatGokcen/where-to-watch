import { Router } from "express";
import { searchMovies } from "../services/tmdb";
import { mapSearchResult } from "../services/mappers";
import { QuerySearch } from "../schemas/common";
import { env } from "../config/env";


const r = Router();


r.get("/", async (req, res, next) => {
try {
const parsed = QuerySearch.parse(req.query);
const region = (parsed.region || env.DEFAULT_REGION).toUpperCase();
const raw = await searchMovies(parsed.query, region);
const mapped = await Promise.all((raw.results || []).map(mapSearchResult));
res.json({ results: mapped });
} catch (err) {
next(err);
}
});


export default r;