import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product.model.js"
import { deleteImage } from "../utils/deleteImg.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addProduct = asyncHandler(async (req, res) => {

    const { CategoryName, ProductName } = req.body

    if (!ProductName || !CategoryName) {
        throw new ApiError(400, "All fields are required");
    }

    const productImgLocalPath = req.files?.img[0]?.path;

    if (!productImgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const product = await Product.create({
        CategoryName,
        ProductName,
        img: {
            url: productImgLocalPath
        }
    })

    return res.status(201).json(
        new ApiResponse(200, product, "Product added Successfully")
    )

})

const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find()

    if (!products) {
        throw new ApiError(400, "products are not found")
    }

    else if (products.length > 0) {
        res.status(201).json(
            new ApiResponse(200, products, "products fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any products")
        )
    }
})

const updateProductDetails = asyncHandler(async (req, res) => {

    const { productId } = req.params
    const { CategoryName, ProductName } = req.body;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid productId");
    }

    if (!(CategoryName && ProductName)) {
        throw new ApiError(400, "CategoryName and ProductName are required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }

    // deleting old img and updating with new one
    const imgToDelete = product.img.url
    const productImgLocalPath = req.files?.img[0]?.path;

    if (!productImgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                CategoryName,
                ProductName,
                img: {
                    url: productImgLocalPath
                }
            }
        },
        { new: true }
    );

    if (!updateProduct) {
        throw new ApiError(500, "Failed to update product please try again");
    }

    if (updateProduct) {
        await deleteImage(imgToDelete);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProduct, "Product updated successfully"));
})

const deleteProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }

    const deleteProduct = await Product.findByIdAndDelete(productId);

    if (!deleteProduct) {
        throw new ApiError(500, "Failed to delete product please try again");
    }

    await deleteImage(product.img.url);

    return res
        .status(200)
        .json(new ApiResponse(200, deleteProduct, "Product deleted successfully"));
})

const searchProduct = asyncHandler(async (req, res) => {

    const products = await Product.find({
        "$or": [
            { CategoryName: { $regex: (req.params.key, 'i') } },
            { ProductName: { $regex: (req.params.key, 'i') } }
        ]
    })

    if (!products) {
        throw new ApiError(400, "products are not found")
    }

    else if (products.length > 0) {
        res.status(201).json(
            new ApiResponse(200, products, "products fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any products")
        )
    }
})

const aggregateProductsWithOptions = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is missing");
    }

    // Fetch the product document using the _id
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // const productName = product.ProductName;
    const productIdValue = product._id;

    // Aggregate based on ProductName
    const productsWithOptions = await Product.aggregate([
        {
            $match: {
                _id: productIdValue
            }
        },
        {
            $lookup: {
                from: 'productoptions',
                localField: '_id',
                foreignField: 'Product',
                as: 'options'
            }
        },
        {
            $project: {
                CategoryName: 1,
                ProductName: 1,
                img: 1,
                options: 1
            }
        }
    ]);

    if (!productsWithOptions?.length) {
        throw new ApiError(404, "Product with options does not exist");
    }

    return res.status(200).json(new ApiResponse(200, productsWithOptions[0], "Product with options fetched successfully"));
});


export {
    addProduct,
    getProduct,
    updateProductDetails,
    deleteProduct,
    searchProduct,
    aggregateProductsWithOptions
}