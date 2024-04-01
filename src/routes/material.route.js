import { Router } from "express";
import { addMaterial, getMaterial, updateMaterial, deleteMaterial, searchMaterial } from "../controllers/material.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addmaterial").post(authenticateToken,addMaterial)
router.route("/getmaterial").get(getMaterial)
router.route("/updatematerial/:materialId").put(authenticateToken,updateMaterial)
router.route("/deletematerial/:materialId").delete(authenticateToken, deleteMaterial)
router.route("/searchmaterial/:key").get(searchMaterial)


export default router 