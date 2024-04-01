import { Router } from "express";
import { addCategory, getCategory, updateCategoryDetails, deleteCategory, searchCategory } from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addcategory").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    authenticateToken,
    addCategory
)

router.route("/getcategory").get(getCategory)

router.route("/updatecategory/:categoryId").put(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    authenticateToken,
    updateCategoryDetails
)

router.route("/deletecategory/:categoryId").delete(authenticateToken, deleteCategory)
router.route("/searchcategory/:key").get(searchCategory)


export default router 