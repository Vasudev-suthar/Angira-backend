import { Router } from "express";
import { addProductOption, getProductOption, updateProductOptionDetails, deleteProductOption, getProductOptionById } from "../controllers/productOption.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

const fieldsConfig = [

    { name: 'Tops[0].displayImage', maxCount: 1 },
    { name: 'Tops[0].images', maxCount: 10 },
    { name: 'Tops[1].displayImage', maxCount: 1 },
    { name: 'Tops[1].images', maxCount: 10 },
    { name: 'Tops[2].displayImage', maxCount: 1 },
    { name: 'Tops[2].images', maxCount: 10 },
    { name: 'Tops[3].displayImage', maxCount: 1 },
    { name: 'Tops[3].images', maxCount: 10 },
    { name: 'Tops[4].displayImage', maxCount: 1 },
    { name: 'Tops[4].images', maxCount: 10 },
    { name: 'Tops[5].displayImage', maxCount: 1 },
    { name: 'Tops[5].images', maxCount: 10 },
    { name: 'Tops[6].displayImage', maxCount: 1 },
    { name: 'Tops[6].images', maxCount: 10 },
    { name: 'Tops[7].displayImage', maxCount: 1 },
    { name: 'Tops[7].images', maxCount: 10 },
    { name: 'Tops[8].displayImage', maxCount: 1 },
    { name: 'Tops[8].images', maxCount: 10 },
    { name: 'Tops[9].displayImage', maxCount: 1 },
    { name: 'Tops[9].images', maxCount: 10 },
    { name: 'Tops[10].displayImage', maxCount: 1 },
    { name: 'Tops[10].images', maxCount: 10 },



    // { name: 'Edges[0].displayImage', maxCount: 1 },
    // { name: 'Edges[0].images', maxCount: 10 },
    // { name: 'Edges[1].displayImage', maxCount: 1 },
    // { name: 'Edges[1].images', maxCount: 10 },
    // { name: 'Edges[2].displayImage', maxCount: 1 },
    // { name: 'Edges[2].images', maxCount: 10 },
    // { name: 'Edges[3].displayImage', maxCount: 1 },
    // { name: 'Edges[3].images', maxCount: 10 },
    // { name: 'Edges[4].displayImage', maxCount: 1 },
    // { name: 'Edges[4].images', maxCount: 10 },
    // { name: 'Edges[5].displayImage', maxCount: 1 },
    // { name: 'Edges[5].images', maxCount: 10 },


    // { name: 'Finish[0].displayImage', maxCount: 1 },
    // { name: 'Finish[0].images', maxCount: 10 },
    // { name: 'Finish[1].displayImage', maxCount: 1 },
    // { name: 'Finish[1].images', maxCount: 10 },
    // { name: 'Finish[2].displayImage', maxCount: 1 },
    // { name: 'Finish[2].images', maxCount: 10 },
    // { name: 'Finish[3].displayImage', maxCount: 1 },
    // { name: 'Finish[3].images', maxCount: 10 },
    // { name: 'Finish[4].displayImage', maxCount: 1 },
    // { name: 'Finish[4].images', maxCount: 10 }
];

router.route("/addproductoption/:productid").post(upload.fields(fieldsConfig), authenticateToken, addProductOption)

router.route("/getproductoption").get(getProductOption)
router.route("/getproductoptionById/:productOptionId").get(getProductOptionById)
router.route("/updateproductoption/:productOptionId").put(upload.fields(fieldsConfig), authenticateToken, updateProductOptionDetails)
router.route("/deleteproductoption/:productOptionId").delete(authenticateToken, deleteProductOption)


export default router 