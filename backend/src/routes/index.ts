import { Router } from "express";
import AuthRouter from "./auth";
import UserRouter from "./user";
import BillingDetailsRouter from "./billing_details";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/billing-details", BillingDetailsRouter);

export default router;