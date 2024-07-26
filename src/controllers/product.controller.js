import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addProduct = asyncHandler(async (req, res) => {

    const { category, name, productCode, hsn, topFinish, legFinish, topMaterial, legMaterial, size, cbm, grossWeight, netWeight, price, Public, newBadge, description, remark } = req.body

    if (!category || !name || !productCode || !hsn || !topFinish || !legFinish || !topMaterial || !legMaterial || !size || !cbm || !grossWeight || !netWeight || !price || !Public || !newBadge || !description || !remark) {
        throw new ApiError(400, "All fields are required");
    }

    const product = await Product.findOne({ name });
    if (product) {
        throw new ApiError(400, "Product already exists");
    }

    const newproduct = await Product.create({
        category,
        name,
        productCode,
        hsn,
        topFinish,
        legFinish,
        topMaterial,
        legMaterial,
        size,
        cbm,
        grossWeight,
        netWeight,
        price,
        Public,
        newBadge,
        description,
        remark
    })

    if (!newproduct) {
        throw new ApiError(500, "Something went wrong while adding product")
    }

    return res.status(201).json(
        new ApiResponse(200, newproduct, "Product added Successfully")
    )

})

const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find()

    if (!products) {
        return res.status(200).json(
             new ApiResponse(200, "products are not found")
         )
     }

    else if (products.length > 0) {
       return res.status(200).json(
            new ApiResponse(200, products, "products fetched successfully")
        )
    }

    else {
       return res.status(200).json(
            new ApiResponse(200, "currantly have not any products")
        )
    }
})

const getProductbyid = asyncHandler(async (req, res) => {

    const { productId } = req.params

    if (!productId) {
        throw new ApiError(400, "Product ID is missing");
    }

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(400, "product are not found")
    }

    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
})

const updateProductDetails = asyncHandler(async (req, res) => {

    const { productId } = req.params
    const { category, name, productCode, hsn, topFinish, legFinish, topMaterial, legMaterial, size, cbm, grossWeight, netWeight, price, Public, newBadge, description, remark } = req.body;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }

    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                category,
                name,
                productCode,
                hsn,
                topFinish,
                legFinish,
                topMaterial,
                legMaterial,
                size,
                cbm,
                grossWeight,
                netWeight,
                price,
                Public,
                newBadge,
                description,
                remark
            }
        },
        { new: true }
    );

    if (!updateProduct) {
        throw new ApiError(500, "Failed to update product please try again");
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

    // await deleteImage(product.img.url);

    return res
        .status(200)
        .json(new ApiResponse(200, deleteProduct, "Product deleted successfully"));
})

const searchProduct = asyncHandler(async (req, res) => {

    const products = await Product.find({
        "$or": [
            { category: { $regex: (req.params.key), $options: 'i' } },
            { name: { $regex: (req.params.key), $options: 'i' } }
        ]
    })

    if (!products) {
       return res.status(200).json(
            new ApiResponse(200, "products are not found")
        )
    }

    else if (products.length > 0) {
       return res.status(200).json(
            new ApiResponse(200, products, "products fetched successfully")
        )
    }

    else {
       return res.status(200).json(
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

    const productIdValue = product._id;

    // Aggregate based on Productid
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
                foreignField: 'ProductID',
                as: 'options'
            }
        },
        {
            $project: {
                category: 1,
                name: 1,
                productCode: 1,
                hsn: 1,
                topFinish: 1,
                legFinish: 1,
                topMaterial: 1,
                legMaterial: 1,
                size: 1,
                cbm: 1,
                grossWeight: 1,
                netWeight: 1,
                price: 1,
                Public: 1,
                newBadge: 1,
                description: 1,
                remark: 1,
                Tops: '$options.Tops',
                // Edges: '$options.Edges',
                // Finish: '$options.Finish'
            }
        }
    ]);

    if (!productsWithOptions?.length) {
        throw new ApiError(404, "Product with options does not exist");
    }

    return res.status(200).json(new ApiResponse(200, productsWithOptions[0], "Product with options fetched successfully"));
});

const aggregateProductWithimage = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is missing");
    }

    // Fetch the product document using the _id
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const productIdValue = product._id;

    // Aggregate based on Productid
    const productWithimage = await Product.aggregate([
        {
            $match: {
                _id: productIdValue
            }
        },
        {
            $lookup: {
                from: 'productimages',
                localField: '_id',
                foreignField: 'ProductID',
                as: 'productimage'
            }
        },
        {
            $project: {
                category: 1,
                name: 1,
                productCode: 1,
                hsn: 1,
                topFinish: 1,
                legFinish: 1,
                topMaterial: 1,
                legMaterial: 1,
                size: 1,
                cbm: 1,
                grossWeight: 1,
                netWeight: 1,
                price: 1,
                Public: 1,
                newBadge: 1,
                description: 1,
                remark: 1,
                images: { $arrayElemAt: ['$productimage.images.url', 0] }
            }
        }
    ]);

    if (!productWithimage?.length) {
        throw new ApiError(404, "Product with image does not exist");
    }

    return res.status(200).json(new ApiResponse(200, productWithimage[0], "Product with image fetched successfully"));
})

export {
    addProduct,
    getProduct,
    updateProductDetails,
    deleteProduct,
    searchProduct,
    aggregateProductsWithOptions,
    aggregateProductWithimage,
    getProductbyid
}