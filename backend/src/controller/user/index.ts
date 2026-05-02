import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../../utils/error";
import { User, BillingDetail, PaymentMethod } from "../../models";
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
            data: {
                id: user.dataValues.id,
                name: user.dataValues.name,
                email: user.dataValues.email,
                phone: user.dataValues.phone,
                role: user.dataValues.role
            }
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

export const getAllUsers = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        // Get all users except admins with their billing details and payment methods
        const users = await User.findAll({
            where: { role: "user" },
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: BillingDetail,
                    as: "billingDetails",
                    required: false,
                    attributes: ["id", "address", "pin", "city", "state", "isVerify", "createdAt", "updatedAt"]
                },
                {
                    model: PaymentMethod,
                    as: "paymentMethods",
                    required: false,
                    attributes: ["id", "bank_name", "account_holder_name", "account_number", "ifsc", "account_type", "isVerify", "createdAt", "updatedAt"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Users retrieved successfully!",
            data: users
        });
    }
    catch (err) {
        next(err);
    }
}

export const deleteUser = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        if (!id) {
            return throwCustomError(400, "User ID is required!");
        }

        const user = await User.findOne({
            where: { id },
            transaction
        });

        if (!user) {
            return throwCustomError(404, "User not found!");
        }

        // Prevent deleting admin users
        if (user.dataValues.role === "admin") {
            return throwCustomError(403, "Cannot delete admin users!");
        }

        await user.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({
            message: "User deleted successfully!"
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const getAllVerifiedEmployees = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        // Get all verified users with their verified billing details and payment methods
        const users = await User.findAll({
            where: {
                role: "user",
                isVerify: true
            },
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: BillingDetail,
                    as: "billingDetails",
                    where: { isVerify: true },
                    required: true,
                    attributes: ["id", "address", "pin", "city", "state", "isVerify"]
                },
                {
                    model: PaymentMethod,
                    as: "paymentMethods",
                    where: { isVerify: true },
                    required: true,
                    attributes: ["id", "bank_name", "account_holder_name", "account_number", "ifsc", "account_type", "isVerify"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Verified employees retrieved successfully!",
            data: users
        });
    }
    catch (err) {
        next(err);
    }
}

// Made with Bob
