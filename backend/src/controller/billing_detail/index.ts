import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../../utils/error";
import { BillingDetail, User } from "../../models";
import { sequelize } from "../../config/db";

export const getAllBillingDetails = async (
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
        const totalCount = await BillingDetail.count();

        // Get paginated billing details
        const billingDetails = await BillingDetail.findAll({
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
            message: "Billing details retrieved successfully!",
            data: billingDetails,
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
            return throwCustomError(400, "Billing detail ID is required!");
        }

        if (typeof isVerify !== "boolean") {
            return throwCustomError(400, "isVerify must be a boolean value!");
        }

        const billingDetail = await BillingDetail.findOne({
            where: { id },
            transaction
        });

        if (!billingDetail) {
            await transaction.rollback();
            return throwCustomError(404, "Billing detail not found!");
        }

        await billingDetail.update({ isVerify }, { transaction });

        await transaction.commit();

        const updatedBillingDetail = await BillingDetail.findOne({
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
            message: "Billing detail verification status updated successfully!",
            data: updatedBillingDetail
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const updateBillingDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return throwCustomError(400, "Billing detail ID is required!");
        }

        // Find the billing detail
        const billingDetail = await BillingDetail.findOne({
            where: { id },
            transaction
        });

        if (!billingDetail) {
            await transaction.rollback();
            return throwCustomError(404, "Billing detail not found!");
        }

        // Update the billing detail
        await billingDetail.update(updateData, { transaction });

        await transaction.commit();

        // Fetch the updated billing detail with user information
        const updatedBillingDetail = await BillingDetail.findOne({
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
            message: "Billing detail updated successfully!",
            data: updatedBillingDetail
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const deleteBillingDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        if (!id) {
            return throwCustomError(400, "Billing detail ID is required!");
        }

        // Find the billing detail
        const billingDetail = await BillingDetail.findOne({
            where: { id },
            transaction
        });

        if (!billingDetail) {
            await transaction.rollback();
            return throwCustomError(404, "Billing detail not found!");
        }

        // Delete the billing detail
        await billingDetail.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            message: "Billing detail deleted successfully!",
            data: { id }
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}
export const createUserBillingDetail = async (
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

        const { address, pin, city, state } = req.body;

        // Validate required fields
        if (!address || !pin || !city || !state) {
            return throwCustomError(400, "All fields (address, pin, city, state) are required!");
        }

        // Create billing detail for the authenticated user
        const billingDetail = await BillingDetail.create(
            {
                address,
                pin,
                city,
                state,
                userId,
                isVerify: false
            },
            { transaction }
        );

        await transaction.commit();

        // Fetch the created billing detail with user information
        const createdBillingDetail = await BillingDetail.findOne({
            where: { id: billingDetail.get("id") },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        res.status(201).json({
            message: "Billing detail created successfully!",
            data: createdBillingDetail
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const getUserBillingDetails = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        // Get all billing details for the authenticated user
        const billingDetails = await BillingDetail.findAll({
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
            message: "User billing details retrieved successfully!",
            data: billingDetails
        });
    }
    catch (err) {
        next(err);
    }
}


// Made with Bob