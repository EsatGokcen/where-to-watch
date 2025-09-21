import dotenv from "dotenv";
import { z } from "zod";


dotenv.config();


const EnvSchema = z.object({
PORT: z.coerce.number().default(4000),
TMDB_API_KEY: z.string().min(10, "TMDB_API_KEY is required"),
DEFAULT_REGION: z.string().length(2).default("GB"),
CACHE_TTL_SECONDS: z.coerce.number().default(86_400),
NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});


export const env = EnvSchema.parse(process.env);