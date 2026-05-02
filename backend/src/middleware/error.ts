import { Request, Response, NextFunction } from "express";

import { showError } from "../utils/error";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    showError(err, res);
}