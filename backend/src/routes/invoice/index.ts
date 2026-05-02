import { Router } from "express";
import {
    getAllInvoices,
    getUserInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    adminUpdateInvoice,
    adminDeleteInvoice
} from "../../controller/invoice";
import { authenticate } from "../../middleware/auth";
import { permission } from "../../middleware/permission";

const router = Router();

// Admin routes - require authentication and admin permission
router.route("/admin").get(authenticate, permission, getAllInvoices);
router.route("/admin/:id").put(authenticate, permission, adminUpdateInvoice);
router.route("/admin/:id").delete(authenticate, permission, adminDeleteInvoice);

// User routes - require authentication only
// Get all invoices for authenticated user
router.route("/").get(authenticate, getUserInvoices);

// Get single invoice by ID (user can only access their own invoices)
router.route("/:id").get(authenticate, getInvoiceById);

// Create new invoice
router.route("/").post(authenticate, createInvoice);

// Update invoice (user can only update their own invoices)
router.route("/:id").put(authenticate, updateInvoice);

// Delete invoice (user can only delete their own invoices)
router.route("/:id").delete(authenticate, deleteInvoice);

export default router;

// Made with Bob