import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { searchMovies, searchTV, searchMulti } from "../services/tmdb";
import { mapSearchResultAny, mapSearchResult } from "../services/mappers";
import { QuerySearch } from "../schemas/common";
import { env } from "../config/env";

const r = Router();

// simple keyword blocklist to be extra-safe beyond TMDB's adult flag
const BLOCKLIST = [
  /porn/i,
  /xxx/i,
  /erotic/i,
  /hentai/i,
  /hardcore/i,
  /nsfw/i,
  /18\+/i,
  /\bsex\b/i,
  /\bnude\b/i,
  /barely\s*legal/i,
];

function isUnsafe(r: any) {
  const title = String(r.title || r.name || "");
  if (r.adult === true) return true;
  return BLOCKLIST.some((re) => re.test(title));
}

r.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = QuerySearch.parse(req.query);
    const region = (parsed.region || env.DEFAULT_REGION).toUpperCase();
    const type = parsed.type ?? "multi";
    const safe = parsed.safe ?? env.SAFE_SEARCH_STRICT;

    let raw: any;
    if (type === "movie") raw = await searchMovies(parsed.query, region);
    else if (type === "tv") raw = await searchTV(parsed.query, region);
    else raw = await searchMulti(parsed.query, region);

    // multi returns people too — drop them; also apply strict filter if enabled
    let results: any[] = (raw.results || []).filter(
      (r: any) => r.media_type !== "person"
    );
    if (safe) results = results.filter((r) => !isUnsafe(r));

    const mapped = await Promise.all(results.map(mapSearchResultAny));
    res.json({ results: mapped });
  } catch (err) {
    next(err);
  }
});

export default r;
