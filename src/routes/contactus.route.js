import { authenticateToken } from "../middlewares/auth.middleware.js"
import { Router } from "express";
import {addContactus, getContactus, updateContactus, deleteContactus} from "../controllers/contactus.controller.js"
import { contactusValidationRules } from "../middlewares/user.validation.js";

const router = Router()

router.route("/addcontactus").post(authenticateToken,contactusValidationRules, addContactus)
router.route("/getcontactus").get(getContactus)
router.route("/updatecontactus/:contactusId").put(authenticateToken,contactusValidationRules, updateContactus)
router.route("/deletecontactus/:contactusId").delete(authenticateToken, deleteContactus)

export default router