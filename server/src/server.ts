import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import health from "./routes/health";
import search from "./routes/search";
import movies from "./routes/movies";
import providers from "./routes/providers";
import cfg from "./routes/config";
import { errorHandler } from "./middleware/error";


export function createServer() {
const app = express();


app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());


// basic rate limit to be nice to TMDB (and your free tier)
app.use(
rateLimit({
windowMs: 60_000,
max: 60,
standardHeaders: true,
legacyHeaders: false,
})
);


app.use(
pinoHttp({
autoLogging: env.NODE_ENV !== "test",
transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
})
);


app.use("/health", health);
app.use("/api/v1/search", search);
app.use("/api/v1/movies", movies);
app.use("/api/v1/movies", providers); // providers route mounts under /:id/providers
app.use("/api/v1/config", cfg);


// central error handler
app.use(errorHandler);


return app;
}