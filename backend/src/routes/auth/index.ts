import { Router } from "express";
import { forgetEmail, forgetVerify, forgetVerifyOtp, login, loginVerify, signUp, signUpResendOtp, signUpVerify } from "../../controller/auth";

const router = Router();

router.route("/login").post(login);
router.route("/login/verify").post(loginVerify);
router.route("/signup").post(signUp);
router.route("/signup/verify").post(signUpVerify);
router.route("/signup/resend").post(signUpResendOtp);
router.route("/forgot-password").post(forgetEmail);
router.route("/forgot-password/verify").post(forgetVerify);
router.route("/forgot-password/resend").post(forgetVerifyOtp);

export default router;