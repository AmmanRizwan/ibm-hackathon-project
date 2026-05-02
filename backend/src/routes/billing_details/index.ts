import { Router } from "express";
import {
    getAllBillingDetails,
    updateIsVerify,
    updateBillingDetail,
    deleteBillingDetail,
    createUserBillingDetail,
    getUserBillingDetails
} from "../../controller/billing_detail";
import { authenticate } from "../../middleware/auth";
import { permission } from "../../middleware/permission";

const router = Router();

// Admin routes - require authentication and admin permission
router.route("/admin").get(authenticate, permission, getAllBillingDetails);
router.route("/admin/:id/verify").put(authenticate, permission, updateIsVerify);
router.route("/admin/:id").put(authenticate, permission, updateBillingDetail);
router.route("/admin/:id").delete(authenticate, permission, deleteBillingDetail);

// User routes - require authentication only
router.route("/").post(authenticate, createUserBillingDetail);
router.route("/").get(authenticate, getUserBillingDetails);

export default router;

// Made with Bob