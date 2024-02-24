import { Router } from "express";
import { addProductOption, getProductOption, updateProductOptionDetails, deleteProductOption } from "../controllers/productOption.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

const fieldsConfig = [
    { name: 'Tops[0][topsimg]', maxCount: 1 },
    { name: 'Tops[1][topsimg]', maxCount: 1 },
    { name: 'Tops[2][topsimg]', maxCount: 1 },
    { name: 'Tops[3][topsimg]', maxCount: 1 },
    { name: 'Tops[4][topsimg]', maxCount: 1 },
    { name: 'Tops[5][topsimg]', maxCount: 1 },
    { name: 'Tops[6][topsimg]', maxCount: 1 },
    { name: 'Tops[7][topsimg]', maxCount: 1 },

    { name: "Edges[0][edgesimg]", maxCount: 1 },
    { name: "Edges[1][edgesimg]", maxCount: 1 },
    { name: "Edges[2][edgesimg]", maxCount: 1 },
    { name: "Edges[3][edgesimg]", maxCount: 1 },
    { name: "Edges[4][edgesimg]", maxCount: 1 },
    { name: "Edges[5][edgesimg]", maxCount: 1 },

    { name: "Finish[0][finishimg]", maxCount: 1 },
    { name: "Finish[1][finishimg]", maxCount: 1 },
    { name: "Finish[2][finishimg]", maxCount: 1 },
    { name: "Finish[3][finishimg]", maxCount: 1 },
    { name: "Finish[4][finishimg]", maxCount: 1 },

];

router.route("/addproductoption/:productid").post(upload.fields(fieldsConfig), authenticateToken, addProductOption)

router.route("/getproductoption").get(authenticateToken, getProductOption)
router.route("/updateproductoption/:productOptionId").put(upload.fields(fieldsConfig), authenticateToken, updateProductOptionDetails)
router.route("/deleteproductoption/:productOptionId").delete(authenticateToken, deleteProductOption)


export default router