import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { getTVDetails } from "../services/tmdb";
import { mapTVDetails } from "../services/mappers";

const r = Router();

r.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const raw = await getTVDetails(id);
    const mapped = await mapTVDetails(raw);
    res.json(mapped);
  } catch (err) {
    next(err);
  }
});

export default r;
