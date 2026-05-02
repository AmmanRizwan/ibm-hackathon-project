import { Router } from "express";
import AuthRouter from "./auth";
import UserRouter from "./user";
import BillingDetailsRouter from "./billing_details";
import PaymentMethod from "./payment_methods";
import InvoiceRouter from "./invoice";
import TransactionRouter from "./transaction";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/billing-details", BillingDetailsRouter);
router.use("/payment-method", PaymentMethod);
router.use("/invoice", InvoiceRouter);
router.use("/transaction", TransactionRouter);

export default router;