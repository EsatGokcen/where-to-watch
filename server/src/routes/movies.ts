import { Router } from "express";
import { getMovieDetails } from "../services/tmdb";
import { mapDetails } from "../services/mappers";


const r = Router();


r.get("/:id", async (req, res, next) => {
try {
const { id } = req.params;
const raw = await getMovieDetails(id);
const mapped = await mapDetails(raw);
res.json(mapped);
} catch (err) {
next(err);
}
});


export default r;