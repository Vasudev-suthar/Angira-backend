import { authenticateToken } from "../middlewares/auth.middleware.js"
import { Router } from "express";
import { addAboutus, getAboutus, updateAboutus, deleteAboutus } from "../controllers/aboutus.controller.js"

const router = Router()

router.route("/addaboutus").post(authenticateToken, addAboutus)
router.route("/getaboutus").get(getAboutus)
router.route("/updateaboutus/:aboutusId").put(authenticateToken, updateAboutus)
router.route("/deleteaboutus/:aboutusId").delete(authenticateToken, deleteAboutus)

export default router