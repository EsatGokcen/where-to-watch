import { Router } from "express";
import { getConfiguration, getWatchProviderRegions } from "../services/tmdb";

const r = Router();
const ALLOW = new Set([
  "US",
  "GB",
  "TR",
  "CA",
  "AU",
  "DE",
  "FR",
  "ES",
  "IT",
  "IN",
  "BR",
  "JP",
]);

r.get("/", async (_req, res, next) => {
  try {
    const cfg = await getConfiguration();
    const regions = await getWatchProviderRegions();

    const supported = regions?.results
      ?.map((x: any) => x.iso_3166_1)
      ?.filter((code: string) => ALLOW.has(code)) // or remove this line to allow ALL
      ?.sort() ?? ["US", "GB", "TR"];

    res.json({
      images: cfg.images,
      attribution:
        "This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data courtesy of JustWatch.",
      supportedRegions: supported,
    });
  } catch (err) {
    next(err);
  }
});

export default r;
