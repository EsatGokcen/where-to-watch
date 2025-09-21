import { Router } from "express";
import { getWatchProviders } from "../services/tmdb";
import { mapProviders } from "../services/mappers";
import { env } from "../config/env";


const r = Router();


r.get("/:id/providers", async (req, res, next) => {
try {
const { id } = req.params;
const region = (String(req.query.region || env.DEFAULT_REGION)).toUpperCase();
const raw = await getWatchProviders(id);
const availability = await mapProviders(raw, region);
res.json({ id: Number(id), region, availability });
} catch (err) {
next(err);
}
});


export default r;