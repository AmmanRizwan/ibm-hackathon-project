import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { throwCustomError } from "../utils/error";
import { verifyToken } from "../utils/jwt";

const authenticate = (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return throwCustomError(401, "Unauthorized");
        }
        
        const [, tokenString] = token.split("Bearer ");

        if (!tokenString) {
            return throwCustomError(401, "Unauthorized");
        }

        const decoded = verifyToken(tokenString);

        if (!decoded) {
            return throwCustomError(401, "Unauthorized");
        }

        req.user = decoded as { id: string };

        next();
    }
    catch (err: unknown) {
        logger.error(err);
        res.status(401).json({ message: "Unauthorized"});
    }
}

export { authenticate };