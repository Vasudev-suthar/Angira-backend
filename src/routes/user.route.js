import { Router } from "express";
import { register, login, getUser, deleteUser, changePassword, updateUserDetails } from "../controllers/user.controller.js";
import { changePasswordValidationRules, registrationValidationRules, updateUserValidationRules } from "../middlewares/user.validation.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registrationValidationRules, register)
router.route("/login").post(login)
router.route("/getuser").get(getUser)
router.route("/deleteuser/:userId").delete(authenticateToken,deleteUser)
router.route("/changepassword/:id").patch(changePasswordValidationRules,authenticateToken,changePassword)
router.route("/updateuser/:userId").patch(updateUserValidationRules,authenticateToken,updateUserDetails)

export default router