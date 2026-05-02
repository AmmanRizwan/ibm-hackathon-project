import { Router } from "express";
import {
    getAllPaymentMethods,
    updateIsVerify,
    updatePaymentMethod,
    deletePaymentMethod,
    createUserPaymentMethod,
    getUserPaymentMethods
} from "../../controller/payment_methods";
import { authenticate } from "../../middleware/auth";
import { permission } from "../../middleware/permission";

const router = Router();

// Admin routes - require authentication and admin permission
router.route("/admin").get(authenticate, permission, getAllPaymentMethods);
router.route("/admin/:id/verify").put(authenticate, permission, updateIsVerify);
router.route("/admin/:id").put(authenticate, permission, updatePaymentMethod);
router.route("/admin/:id").delete(authenticate, permission, deletePaymentMethod);

// User routes - require authentication only
router.route("/").post(authenticate, createUserPaymentMethod);
router.route("/").get(authenticate, getUserPaymentMethods);

export default router;

// Made with Bob