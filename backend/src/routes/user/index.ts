import { Router } from "express";
import { getMe, updateUserDetail } from "../../controller/user";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.route("/me").get(authenticate, getMe);
router.route("/update").put(authenticate, updateUserDetail);

export default router;

// Made with Bob
