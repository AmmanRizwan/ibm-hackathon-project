import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../../utils/error";
import { Transaction, User } from "../../models";
import { sequelize } from "../../config/db";
import { Op } from "sequelize";

// Admin: Get all transactions
export const getAllTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Optional filters
        const status = req.query.status as string;
        const whereClause: Record<string, unknown> = {};

        if (status) {
            whereClause.status = status;
        }

        // Get total count
        const totalCount = await Transaction.count({ where: whereClause });

        // Get paginated transactions
        const transactions = await Transaction.findAll({
            where: whereClause,
            order: [["transaction_date", "DESC"]],
            limit,
            offset
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            message: "Transactions retrieved successfully!",
            data: transactions,
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

// Admin: Get transaction by ID
export const getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return throwCustomError(400, "Transaction ID is required!");
        }

        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return throwCustomError(404, "Transaction not found!");
        }

        res.status(200).json({
            message: "Transaction retrieved successfully!",
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
}

// Admin: Create transaction
export const createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            payer_bank_account_id,
            payee_bank_account_id,
            payer_name,
            payer_email,
            payee_name,
            payee_email,
            invoiceId,
            amount,
            transaction_date,
            status
        } = req.body;

        // Validate required fields
        if (!payee_bank_account_id || !payer_name ||
            !payer_email || !payee_name || !payee_email || !invoiceId || !amount) {
            return throwCustomError(400, "All required fields must be provided!");
        }

        // Validate amount
        if (amount <= 0) {
            return throwCustomError(400, "Amount must be greater than zero!");
        }

        // Create transaction
        const newTransaction = await Transaction.create(
            {
                payer_bank_account_id,
                payee_bank_account_id,
                payer_name,
                payer_email,
                payee_name,
                payee_email,
                invoiceId,
                amount,
                transaction_date: transaction_date || new Date(),
                status: status || "pending"
            },
            { transaction }
        );

        await transaction.commit();

        res.status(201).json({
            message: "Transaction created successfully!",
            data: newTransaction
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Admin: Update transaction
export const updateTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id || Array.isArray(id)) {
            return throwCustomError(400, "Transaction ID is required!");
        }

        // Find the transaction
        const existingTransaction = await Transaction.findByPk(id, { transaction });

        if (!existingTransaction) {
            await transaction.rollback();
            return throwCustomError(404, "Transaction not found!");
        }

        // Validate amount if being updated
        if (updateData.amount !== undefined && updateData.amount <= 0) {
            await transaction.rollback();
            return throwCustomError(400, "Amount must be greater than zero!");
        }

        // Update the transaction
        await existingTransaction.update(updateData, { transaction });

        await transaction.commit();

        // Fetch the updated transaction
        const updatedTransaction = await Transaction.findByPk(id);

        res.status(200).json({
            message: "Transaction updated successfully!",
            data: updatedTransaction
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Admin: Delete transaction
export const deleteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return throwCustomError(400, "Transaction ID is required!");
        }

        // Find the transaction
        const existingTransaction = await Transaction.findByPk(id, { transaction });

        if (!existingTransaction) {
            await transaction.rollback();
            return throwCustomError(404, "Transaction not found!");
        }

        // Delete the transaction
        await existingTransaction.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            message: "Transaction deleted successfully!",
            data: { id }
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// User: Get transaction by user ID and transaction ID
export const getUserTransaction = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const { transactionId } = req.params;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        if (!transactionId || Array.isArray(transactionId)) {
            return throwCustomError(400, "Transaction ID is required!");
        }

        // Get user details
        const user = await User.findByPk(userId);

        if (!user) {
            return throwCustomError(404, "User not found!");
        }

        const userEmail = user.get("email") as string;

        // Find transaction where user is either payer or payee
        const transaction = await Transaction.findOne({
            where: {
                id: transactionId,
                [Op.or]: [
                    { payer_email: userEmail },
                    { payee_email: userEmail }
                ]
            }
        });

        if (!transaction) {
            return throwCustomError(404, "Transaction not found or you don't have access to it!");
        }

        res.status(200).json({
            message: "Transaction retrieved successfully!",
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
}

// User: Get all transactions for authenticated user
export const getUserTransactions = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Get user details
        const user = await User.findByPk(userId);

        if (!user) {
            return throwCustomError(404, "User not found!");
        }

        const userEmail = user.get("email") as string;

        // Optional filters
        const status = req.query.status as string;
        const whereClause: Record<string, unknown> = {
            [Op.or]: [
                { payer_email: userEmail },
                { payee_email: userEmail }
            ]
        };

        if (status) {
            whereClause.status = status;
        }

        // Get total count
        const totalCount = await Transaction.count({ where: whereClause });

        // Get paginated transactions
        const transactions = await Transaction.findAll({
            where: whereClause,
            order: [["transaction_date", "DESC"]],
            limit,
            offset
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            message: "User transactions retrieved successfully!",
            data: transactions,
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

// Made with Bob