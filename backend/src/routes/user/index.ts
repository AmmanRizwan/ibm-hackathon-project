import { Router } from "express";
import { getMe, updateUserDetail, getAllUsers, deleteUser, getAllVerifiedEmployees } from "../../controller/user";
import { authenticate } from "../../middleware/auth";
import { permission } from "../../middleware/permission";

const router = Router();

router.route("/me").get(authenticate, getMe);
router.route("/update").put(authenticate, updateUserDetail);
router.route("/all").get(authenticate, permission, getAllUsers);
router.route("/verified-employees").get(authenticate, permission, getAllVerifiedEmployees);
router.route("/:id").delete(authenticate, permission, deleteUser);

export default router;

// Made with Bob
