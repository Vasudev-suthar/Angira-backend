import { Router } from "express";
import { register, login, getAdmin, deleteAdmin, changePassword, updateAdminDetails } from "../controllers/admin.controller.js";
import { changePasswordValidationRules, registrationValidationRules, updateUserValidationRules } from "../middlewares/admin.validation.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registrationValidationRules, register)
router.route("/login").post(login)
router.route("/getuser").get(getAdmin)
router.route("/deleteuser/:adminId").delete(authenticateToken,deleteAdmin)
router.route("/changepassword/:id").patch(changePasswordValidationRules,authenticateToken,changePassword)
router.route("/updateuser/:adminId").patch(updateUserValidationRules,authenticateToken,updateAdminDetails)

export default router