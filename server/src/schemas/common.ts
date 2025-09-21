import { z } from "zod";


export const RegionParam = z
.string()
.length(2)
.transform((s) => s.toUpperCase());


export const QuerySearch = z.object({
query: z.string().min(1, "query is required"),
region: z.string().length(2).optional(),
});