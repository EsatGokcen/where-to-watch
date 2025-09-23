import { Router } from "express";
import { getConfiguration } from "../services/tmdb";

const r = Router();

r.get("/", async (_req, res, next) => {
  try {
    const cfg = await getConfiguration();
    res.json({
      images: cfg.images,
      attribution:
        "This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data courtesy of JustWatch.",
      supportedRegions: ["US", "GB", "TR"],
    });
  } catch (err) {
    next(err);
  }
});

export default r;
