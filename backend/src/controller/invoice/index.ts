import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../../utils/error";
import { Invoice, User } from "../../models";
import { sequelize } from "../../config/db";
import { sendEmail } from "../../services/smtp";

// Get all invoices (Admin only)
export const getAllInvoices = async (
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
        const totalCount = await Invoice.count();

        // Get paginated invoices
        const invoices = await Invoice.findAll({
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
            message: "Invoices retrieved successfully!",
            data: invoices,
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

// Get invoices by authenticated user
export const getUserInvoices = async (
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

        // Get total count for user
        const totalCount = await Invoice.count({ where: { userId } });

        // Get paginated invoices for the authenticated user
        const invoices = await Invoice.findAll({
            where: { userId },
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
            message: "User invoices retrieved successfully!",
            data: invoices,
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

// Get single invoice by ID
export const getInvoiceById = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        if (!id) {
            return throwCustomError(400, "Invoice ID is required!");
        }

        const invoice = await Invoice.findOne({
            where: { id, userId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        if (!invoice) {
            return throwCustomError(404, "Invoice not found!");
        }

        res.status(200).json({
            message: "Invoice retrieved successfully!",
            data: invoice
        });
    }
    catch (err) {
        next(err);
    }
}

// Create invoice
export const createInvoice = async (
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

        const {
            invoice_number,
            invoice_date,
            customer_name,
            customer_email,
            customer_phone,
            total_amount,
            payment_status,
            notes,
            status
        } = req.body;

        // Validate required fields
        if (!invoice_number || !customer_name || !total_amount) {
            return throwCustomError(400, "Invoice number, customer name, and total amount are required!");
        }

        // Check if invoice number already exists
        const existingInvoice = await Invoice.findOne({
            where: { invoice_number },
            transaction
        });

        if (existingInvoice) {
            await transaction.rollback();
            return throwCustomError(400, "Invoice number already exists!");
        }

        // Create invoice for the authenticated user
        const invoice = await Invoice.create(
            {
                invoice_number,
                invoice_date: invoice_date || new Date(),
                customer_name,
                customer_email,
                customer_phone,
                total_amount,
                payment_status: payment_status || "pending",
                notes,
                status: status || "draft",
                userId
            },
            { transaction }
        );

        await transaction.commit();

        // Fetch the created invoice with user information
        const createdInvoice = await Invoice.findOne({
            where: { id: invoice.get("id") },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "phone"]
                }
            ]
        });

        // Send email to customer if email is provided
        if (customer_email) {
            try {
                await sendEmail({
                    to: customer_email,
                    subject: `Invoice ${invoice_number} - ${customer_name}`,
                    template: "invoice/invoice",
                    context: {
                        invoice_number: invoice_number,
                        invoice_date: invoice_date || new Date().toISOString(),
                        customer_name: customer_name,
                        customer_email: customer_email || "",
                        customer_phone: customer_phone || "",
                        total_amount: total_amount.toString(),
                        payment_status: payment_status || "pending",
                        notes: notes || "",
                        status: status || "draft"
                    }
                });
            } catch (emailError) {
                // Log email error but don't fail the invoice creation
                console.error("Failed to send invoice email:", emailError);
            }
        }

        res.status(201).json({
            message: "Invoice created successfully!",
            data: createdInvoice
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Update invoice
export const updateInvoice = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const updateData = req.body;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        if (!id) {
            return throwCustomError(400, "Invoice ID is required!");
        }

        // Find the invoice belonging to the authenticated user
        const invoice = await Invoice.findOne({
            where: { id, userId },
            transaction
        });

        if (!invoice) {
            await transaction.rollback();
            return throwCustomError(404, "Invoice not found!");
        }

        // If updating invoice_number, check for duplicates
        if (updateData.invoice_number && updateData.invoice_number !== invoice.get("invoice_number")) {
            const existingInvoice = await Invoice.findOne({
                where: { invoice_number: updateData.invoice_number },
                transaction
            });

            if (existingInvoice) {
                await transaction.rollback();
                return throwCustomError(400, "Invoice number already exists!");
            }
        }

        // Update the invoice
        await invoice.update(updateData, { transaction });

        await transaction.commit();

        // Fetch the updated invoice with user information
        const updatedInvoice = await Invoice.findOne({
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
            message: "Invoice updated successfully!",
            data: updatedInvoice
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Delete invoice
export const deleteInvoice = async (
    req: Request & { user?: { id: string }},
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return throwCustomError(401, "Unauthorized");
        }

        if (!id) {
            return throwCustomError(400, "Invoice ID is required!");
        }

        // Find the invoice belonging to the authenticated user
        const invoice = await Invoice.findOne({
            where: { id, userId },
            transaction
        });

        if (!invoice) {
            await transaction.rollback();
            return throwCustomError(404, "Invoice not found!");
        }

        // Delete the invoice
        await invoice.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            message: "Invoice deleted successfully!",
            data: { id }
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Admin: Update any invoice
export const adminUpdateInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return throwCustomError(400, "Invoice ID is required!");
        }

        // Find the invoice
        const invoice = await Invoice.findOne({
            where: { id },
            transaction
        });

        if (!invoice) {
            await transaction.rollback();
            return throwCustomError(404, "Invoice not found!");
        }

        // If updating invoice_number, check for duplicates
        if (updateData.invoice_number && updateData.invoice_number !== invoice.get("invoice_number")) {
            const existingInvoice = await Invoice.findOne({
                where: { invoice_number: updateData.invoice_number },
                transaction
            });

            if (existingInvoice) {
                await transaction.rollback();
                return throwCustomError(400, "Invoice number already exists!");
            }
        }

        // Update the invoice
        await invoice.update(updateData, { transaction });

        await transaction.commit();

        // Fetch the updated invoice with user information
        const updatedInvoice = await Invoice.findOne({
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
            message: "Invoice updated successfully!",
            data: updatedInvoice
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Admin: Delete any invoice
export const adminDeleteInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        if (!id) {
            return throwCustomError(400, "Invoice ID is required!");
        }

        // Find the invoice
        const invoice = await Invoice.findOne({
            where: { id },
            transaction
        });

        if (!invoice) {
            await transaction.rollback();
            return throwCustomError(404, "Invoice not found!");
        }

        // Delete the invoice
        await invoice.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            message: "Invoice deleted successfully!",
            data: { id }
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

// Made with Bob