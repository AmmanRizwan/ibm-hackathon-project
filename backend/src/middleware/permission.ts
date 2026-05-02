import { Request, NextFunction, Response } from "express";
import { User } from "../models";
import { throwCustomError } from "../utils/error";
import { logger } from "../utils/logger";

const permission = async (req: Request & { user?: { id: string }}, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(404, "user is not authenticated");
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return throwCustomError(404, "Cannot find the user!");
        }

        if (user.dataValues.role !== "ADMIN") {
            return throwCustomError(403, "User is not administrator");
        }

        next();
    }
    catch (err) {
        logger.error(err);
        res.status(403).json({ message: "User is not administrator"});
    }
}

export { permission };