import { Router } from "express";
import { registerUser, loginUser, getUser, deleteUser, changePassword, updateUserDetails } from "../controllers/user.controller.js";
import { changePasswordValidationRules, registrationValidationRules, updateUserValidationRules, validate } from "../middlewares/user.validation.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registrationValidationRules,validate, registerUser)
router.route("/login").post(loginUser)
router.route("/getuser").get(authenticateToken,getUser)
router.route("/deleteuser/:userId").delete(authenticateToken,deleteUser)
router.route("/changepassword/:id").put(changePasswordValidationRules,validate,authenticateToken,changePassword)
router.route("/updateuser/:userId").put(updateUserValidationRules,validate,authenticateToken,updateUserDetails)

export default router