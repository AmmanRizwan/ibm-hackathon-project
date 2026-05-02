import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../../utils/error";
import { PaymentMethod, User } from "../../models";
import { sequelize } from "../../config/db";

export const getAllPaymentMethods = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Get total count
        const totalCount = await PaymentMethod.count();

        // Get paginated payment methods
        const paymentMethods = await PaymentMethod.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            message: "Payment methods retrieved successfully!",
            data: paymentMethods,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    }
    catch (err) {
        next(err);
    }
}

export const updateIsVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { isVerify } = req.body;

        if (!id) {
            return throwCustomError(400, "Payment method ID is required!");
        }

        if (typeof isVerify !== "boolean") {
            return throwCustomError(400, "isVerify must be a boolean value!");
        }

        const paymentMethod = await PaymentMethod.findOne({
            where: { id },
            transaction
        });

        if (!paymentMethod) {
            await transaction.rollback();
            return throwCustomError(404, "Payment method not found!");
        }

        await paymentMethod.update({ isVerify }, { transaction });

        await transaction.commit();

        const updatedPaymentMethod = await PaymentMethod.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        res.status(200).json({
            message: "Payment method verification status updated successfully!",
            data: updatedPaymentMethod
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const updatePaymentMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return throwCustomError(400, "Payment method ID is required!");
        }

        // Find the payment method
        const paymentMethod = await PaymentMethod.findOne({
            where: { id },
            transaction
        });

        if (!paymentMethod) {
            await transaction.rollback();
            return throwCustomError(404, "Payment method not found!");
        }

        // Update the payment method
        await paymentMethod.update(updateData, { transaction });

        await transaction.commit();

        // Fetch the updated payment method with user information
        const updatedPaymentMethod = await PaymentMethod.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        res.status(200).json({
            message: "Payment method updated successfully!",
            data: updatedPaymentMethod
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const deletePaymentMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        if (!id) {
            return throwCustomError(400, "Payment method ID is required!");
        }

        // Find the payment method
        const paymentMethod = await PaymentMethod.findOne({
            where: { id },
            transaction
        });

        if (!paymentMethod) {
            await transaction.rollback();
            return throwCustomError(404, "Payment method not found!");
        }

        // Delete the payment method
        await paymentMethod.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            message: "Payment method deleted successfully!",
            data: { id }
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const createUserPaymentMethod = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        const { bank_name, account_holder_name, account_type, ifsc, account_number } = req.body;

        // Validate required fields
        if (!bank_name || !account_holder_name || !account_type || !ifsc || !account_number) {
            return throwCustomError(400, "All fields (bank_name, account_holder_name, account_type, ifsc, account_number) are required!");
        }

        // Create payment method for the authenticated user
        const paymentMethod = await PaymentMethod.create(
            {
                bank_name,
                account_holder_name,
                account_type,
                ifsc,
                account_number,
                userId,
                isVerify: false
            },
            { transaction }
        );

        await transaction.commit();

        // Fetch the created payment method with user information
        const createdPaymentMethod = await PaymentMethod.findOne({
            where: { id: paymentMethod.get("id") },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        res.status(201).json({
            message: "Payment method created successfully!",
            data: createdPaymentMethod
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const getUserPaymentMethods = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        // Get all payment methods for the authenticated user
        const paymentMethods = await PaymentMethod.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "User payment methods retrieved successfully!",
            data: paymentMethods
        });
    }
    catch (err) {
        next(err);
    }
}


// Made with Bob