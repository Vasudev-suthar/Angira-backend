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
            .json(new ApiResponse(200, "product Images is set Already"));
    }

    const productImgLocalPaths = req.files?.images?.map(file => file.path);

    if (!productImgLocalPaths || productImgLocalPaths.length === 0) {
        throw new ApiError(400, "Images files are required");
    }

    const productImages = productImgLocalPaths.map(path => ({
        url: path
    }));

    const newProductImages = await ProductImage.create({
        ProductID: productImageId,
        images: productImages
    });

    if (!newProductImages) {
        throw new ApiError(500, "Something went wrong while adding product Image")
    }

    return res.status(201).json(
        new ApiResponse(200, newProductImages, "Product Images added Successfully")
    )

})

const getProductImage = asyncHandler(async (req, res) => {
    const productsImage = await ProductImage.find()

    if (!productsImage) {
        return res.status(200).json(
             new ApiResponse(200, "products images are not found")
         )
     }

    else if (productsImage.length > 0) {
       return res.status(201).json(
            new ApiResponse(200, productsImage, "products images fetched successfully")
        )
    }

    else {
       return res.status(201).json(
            new ApiResponse(200, "currantly have not any products images")
        )
    }
})

const getProductImageById = asyncHandler(async (req, res) => {
    const { productImageId } = req.params;

    if (!productImageId) {
        throw new ApiError(400, "Product Image ID is missing");
    }

    const productImage = await ProductImage.findById(productImageId);

    if (!productImage) {
        throw new ApiError(404, "Product Image not found");
    }

    return res.status(200).json(new ApiResponse(200, productImage, "Product Image fetched successfully"));
});


const updateProductImage = asyncHandler(async (req, res) => {

    const { productImageId } = req.params;

    if (!isValidObjectId(productImageId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const product = await ProductImage.findById(productImageId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }

    const productImgLocalPaths = req.files?.images?.map(file => ({
        url: file.path
    }));

    if (!productImgLocalPaths || productImgLocalPaths.length === 0) {
        throw new ApiError(400, "Image files are required");
    }

    
    // Update product images with new ones
    const updateProductimage = await ProductImage.findByIdAndUpdate(
        productImageId,
        { $set: { images: productImgLocalPaths } },
        { new: true }
    );
    
    if (!updateProductimage) {
        throw new ApiError(500, "Failed to update product Image please try again");
    }
    
    // Delete old images
    const imgsToDelete = product.images.map(img => img.url);
    await Promise.all(imgsToDelete.map(deleteImage));
    
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

    const imgsToDelete = product.images.map(img => img.url);

    const deleteProductimage = await ProductImage.findByIdAndDelete(productImageId);
    
    if (!deleteProductimage) {
        throw new ApiError(500, "Failed to delete product please try again");
    }
    
    // Delete images
    await Promise.all(imgsToDelete.map(deleteImage));
    
    return res
        .status(200)
        .json(new ApiResponse(200, deleteProductimage, "Product Images deleted successfully"));
})


export {
    addProductImage,
    getProductImage,
    getProductImageById,
    updateProductImage,
    deleteProductImage
}