import { Router } from "express";
import { register, login } from "../controllers/admin.controller.js";
import { registrationValidationRules } from "../middlewares/admin.validation.js";

const router = Router()

router.route("/register").post(registrationValidationRules, register)
router.route("/login").post(login)

export default router