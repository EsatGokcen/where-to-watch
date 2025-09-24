import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { getTVWatchProviders } from "../services/tmdb";
import { mapProviders } from "../services/mappers";
import { env } from "../config/env";

const r = Router();

r.get(
  "/:id/providers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const region = String(
        req.query.region || env.DEFAULT_REGION
      ).toUpperCase();
      const raw = await getTVWatchProviders(id);
      const availability = await mapProviders(raw, region);
      res.json({ id: Number(id), region, availability });
    } catch (err) {
      next(err);
    }
  }
);

export default r;
