import { Router } from "express";
import { addProductImage, getProductImage, deleteProductImage, updateProductImage } from "../controllers/productImage.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addproductImage/:productImageId").post(
    upload.fields([
        {
            name: "images",
            maxCount: 8
        }
    ]),
    authenticateToken,
    addProductImage
)

router.route("/getproductImage").get(getProductImage)

router.route("/updateproductImage/:productImageId").put(
    upload.fields([
        {
            name: "images",
            maxCount: 8
        }
    ]),
    authenticateToken,
    updateProductImage
)

router.route("/deleteproductImage/:productImageId").delete(authenticateToken, deleteProductImage)


export default router 