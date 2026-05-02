import { Router } from "express";
import {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getUserTransaction,
    getUserTransactions
} from "../../controller/transaction";
import { authenticate } from "../../middleware/auth";
import { permission } from "../../middleware/permission";

const router = Router();

// Admin routes - require authentication and admin permission
// Get all transactions (with optional filters and pagination)
router.route("/admin").get(authenticate, permission, getAllTransactions);

// Get single transaction by ID (admin can access any transaction)
router.route("/admin/:id").get(authenticate, permission, getTransactionById);

// Create new transaction
router.route("/admin").post(authenticate, permission, createTransaction);

// Update transaction
router.route("/admin/:id").put(authenticate, permission, updateTransaction);

// Delete transaction
router.route("/admin/:id").delete(authenticate, permission, deleteTransaction);

// User routes - require authentication only
// Get all transactions for authenticated user (where user is payer or payee)
router.route("/").get(authenticate, getUserTransactions);

// Get specific transaction by transaction ID (user can only access their own transactions)
router.route("/:transactionId").get(authenticate, getUserTransaction);

export default router;

// Made with Bob