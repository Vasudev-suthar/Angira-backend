import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { deleteImage } from "../utils/deleteImg.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import { ProductImage } from "../models/productImage.model.js"

const addProductImage = asyncHandler(async (req, res) => {

    const { productImageId } = req.params

    if (!isValidObjectId(productImageId)) {
        throw new ApiError(400, "Invalid productImageId");
    }

    const productsetAlready = await ProductImage.findOne({
        ProductID: productImageId,
    });

    if (productsetAlready) {
        return res
            .status(200)
            .json(new ApiResponse(200, "product Image is set Already"));
    }

    const productImgLocalPath = req.files?.image?.[0]?.path;

    if (!productImgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const newproductImage = await ProductImage.create({
        ProductID: productImageId,
        image: {
            url: productImgLocalPath
        }
    })

    if (!newproductImage) {
        throw new ApiError(500, "Something went wrong while adding product Image")
    }

    return res.status(201).json(
        new ApiResponse(200, newproductImage, "Product Image added Successfully")
    )

})

const getProductImage = asyncHandler(async (req, res) => {
    const productsImage = await ProductImage.find()

    if (!productsImage) {
        throw new ApiError(400, "products are not found")
    }

    else if (productsImage.length > 0) {
        res.status(201).json(
            new ApiResponse(200, productsImage, "products fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any products")
        )
    }
})

const updateProductImage = asyncHandler(async (req, res) => {

    const { productImageId } = req.params;

    if (!isValidObjectId(productImageId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const product = await ProductImage.findById(productImageId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }

    // deleting old img and updating with new one
    const imgToDelete = product.image.url
    const productImgLocalPath = req.files?.image?.[0]?.path;

    if (!productImgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const updateProductimage = await ProductImage.findByIdAndUpdate(
        productImageId,
        {
            $set: {
                image: {
                    url: productImgLocalPath
                }
            }
        },
        { new: true }
    );

    if (!updateProductimage) {
        throw new ApiError(500, "Failed to update product Image please try again");
    }

    if (updateProductimage) {
        await deleteImage(imgToDelete);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProductimage, "Product updated successfully"));
})

const deleteProductImage = asyncHandler(async (req, res) => {

    const { productImageId } = req.params

    if (!isValidObjectId(productImageId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const product = await ProductImage.findById(productImageId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }

    const deleteProductimage = await ProductImage.findByIdAndDelete(productImageId);

    if (!deleteProductimage) {
        throw new ApiError(500, "Failed to delete product please try again");
    }

    await deleteImage(product.image.url);

    return res
        .status(200)
        .json(new ApiResponse(200, deleteProductimage, "Product Image deleted successfully"));
})


export {
    addProductImage,
    getProductImage,
    updateProductImage,
    deleteProductImage
}