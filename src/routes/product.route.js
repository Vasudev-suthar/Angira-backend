import { Router } from "express";
import { addProduct, aggregateProductsWithOptions, deleteProduct, getProduct, searchProduct, updateProductDetails,aggregateProductWithimage, getProductbyid } from "../controllers/product.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addproduct").post(
    authenticateToken,
    addProduct
)

router.route("/getproduct").get(getProduct)
router.route("/getproductbyid/:productId").get(getProductbyid)

router.route("/updateproduct/:productId").put(
    authenticateToken,
    updateProductDetails
)

router.route("/deleteproduct/:productId").delete(authenticateToken, deleteProduct)
router.route("/searchproduct/:key").get(searchProduct)
router.route("/productoption/:productId").get(aggregateProductsWithOptions)
router.route("/productimage/:productId").get(aggregateProductWithimage)


export default router 