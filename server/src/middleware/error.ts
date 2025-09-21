import type { NextFunction, Request, Response } from "express";


export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
const status = err.statusCode || err.status || 500;
const code = err.code || (status === 404 ? "NOT_FOUND" : "INTERNAL_ERROR");
const message = err.message || "Unexpected server error";
res.status(status).json({ error: { code, message } });
}