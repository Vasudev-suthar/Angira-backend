import { Router } from "express";
import { addProduct, aggregateProductsWithOptions, deleteProduct, getProduct, searchProduct, updateProductDetails } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addproduct").post(
    upload.fields([
        {
            name: "img",
            maxCount: 1
        }
    ]),
    authenticateToken,
    addProduct
)

router.route("/getproduct").get(authenticateToken, getProduct)

router.route("/updateproduct/:productId").put(
    upload.fields([
        {
            name: "img",
            maxCount: 1
        }
    ]),
    authenticateToken,
    updateProductDetails
)

router.route("/deleteproduct/:productId").delete(authenticateToken, deleteProduct)
router.route("/searchproduct/:key").get(authenticateToken, searchProduct)
router.route("/productoption/:productId").get(authenticateToken, aggregateProductsWithOptions)


export default router