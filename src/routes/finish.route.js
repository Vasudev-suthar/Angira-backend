import { Router } from "express";
import {addFinish, getFinish, updateFinish, deleteFinish, searchFinish} from "../controllers/finish.controller.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addfinish").post(authenticateToken,addFinish)
router.route("/getfinish").get(getFinish)
router.route("/updatefinish/:finishId").put(authenticateToken,updateFinish)
router.route("/deletefinish/:finishId").delete(authenticateToken, deleteFinish)
router.route("/searchfinish/:key").get(searchFinish)


export default router 