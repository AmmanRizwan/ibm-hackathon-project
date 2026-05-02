import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../../utils/error";
import { User } from "../../models";
import { sequelize } from "../../config/db";
import { hashPassword } from "../../utils/bcrypt";

export const getMe = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        const user = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return throwCustomError(404, "User not found!");
        }

        res.status(200).json({
            message: "User retrieved successfully!",
            data: user
        });
    }
    catch (err) {
        next(err);
    }
}

export const updateUserDetail = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        const { name, phone, password } = req.body;

        const user = await User.findOne({
            where: { id: userId },
            transaction
        });

        if (!user) {
            return throwCustomError(404, "User not found!");
        }

        const updateData: Record<string, string> = {};

        if (name) {
            updateData.name = name;
        }

        if (phone) {
            updateData.phone = phone;
        }

        if (password) {
            updateData.password = hashPassword(password);
        }

        if (Object.keys(updateData).length === 0) {
            return throwCustomError(400, "No fields to update!");
        }

        await user.update(updateData, { transaction });

        await transaction.commit();

        const updatedUser = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ["password"] }
        });

        res.status(200).json({
            message: "User updated successfully!",
            data: updatedUser
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Made with Bob
