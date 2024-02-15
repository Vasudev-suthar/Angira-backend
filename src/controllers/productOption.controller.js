import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Productoption } from "../models/productOption.model.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose, { isValidObjectId } from "mongoose"


const addProductOption = asyncHandler(async (req, res) => {
    const { ProductName, Tops, Edges, Finish } = req.body;

    if (!ProductName || !Tops || !Edges || !Finish) {
        throw new ApiError(400, "All fields are required");
    }

    // Ensure Tops, Edges, and Finish are arrays
    if (!Array.isArray(Tops) || !Array.isArray(Edges) || !Array.isArray(Finish)) {
        throw new ApiError(400, "Tops, Edges, and Finish must be arrays");
    }

    // Check if there are at least one top, edge, and finish
    if (Tops.length === 0 || Edges.length === 0 || Finish.length === 0) {
        throw new ApiError(400, "At least one top, edge, and finish are required");
    }

    // Define arrays to store processed images and names
    const topsImages = [];
    const edgesImages = [];
    const finishesImages = [];

    // Upload and process images for Tops
    await Promise.all(Tops.map(async(top, index) => {
        const topImages = req.files[`Tops[${index}][topsimg]`];
        const topNames = top.topname.split(',');

        if (!topImages || !topImages.length) {
            throw new ApiError(400, `No images found for Tops[${index}][topsimg]`);
        }

        await Promise.all(topImages.map(async (file, fileIndex) => {
            const topsimgLocalPath = file.path;
            const topImg = await uploadOnCloudinary(topsimgLocalPath);
            if (!topImg) {
                throw new ApiError(400, "Failed to upload Tops image");
            }

            const topname = topNames[fileIndex].trim();

            topsImages.push({
                topname: topname,
                topsimg: {
                    url: topImg.url,
                    public_id: topImg.public_id
                }
            });
        }))
    }))


    await Promise.all(Edges.map(async(edge, index) => {
        const edgeImages = req.files[`Edges[${index}][edgesimg]`];
        const edgeNames = edge.edgename.split(',');

        if (!edgeImages || !edgeImages.length) {
            throw new ApiError(400, `No images found for Edges[${index}][edgesimg]`);
        }

        await Promise.all(edgeImages.map(async (file, fileIndex) => {
            const edgesimgLocalPath = file.path;
            const edgeImg = await uploadOnCloudinary( edgesimgLocalPath);
            if (!edgeImg) {
                throw new ApiError(400, "Failed to upload Edges image");
            }

            const edgename = edgeNames[fileIndex].trim();

            edgesImages.push({
                edgename: edgename,
                edgesimg: {
                    url: edgeImg.url,
                    public_id: edgeImg.public_id
                }
            });
        }))
    }))


    await Promise.all(Finish.map(async(finish, index) => {
        const finishImages = req.files[`Finish[${index}][finishimg]`];
        const finishNames = finish.finishname.split(',');

        if (!finishImages || !finishImages.length) {
            throw new ApiError(400, `No images found for Finish[${index}][finishimg]`);
        }

        await Promise.all(finishImages.map(async (file, fileIndex) => {
            const finishimgLocalPath = file.path;
            const finishImg = await uploadOnCloudinary(finishimgLocalPath);
            if (!finishImg) {
                throw new ApiError(400, "Failed to upload Tops image");
            }

            const finishname = finishNames[fileIndex].trim();

            finishesImages.push({
                finishname: finishname,
                finishimg: {
                    url: finishImg.url,
                    public_id: finishImg.public_id
                }
            });
        }))
    }))


    // Create product option with the processed data
    const productOption = await Productoption.create({
        ProductName,
        Tops: topsImages,
        Edges: edgesImages,
        Finish: finishesImages
    });

    return res.status(201).json(new ApiResponse(200, productOption, "Product added Successfully"));
});


const getProductOption = asyncHandler(async (req, res) => {
    const productOption = await Productoption.find()

    if (!productOption) {
        throw new ApiError(400, "product Options are not found")
    }

    else if (productOption.length > 0) {
        res.status(201).json(
            new ApiResponse(200, productOption, "product Options fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any product Options")
        )
    }
})

const updateProductOptionDetails = asyncHandler(async (req, res) => {
    const { productOptionId } = req.params;
    const { ProductName, Tops, Edges, Finish } = req.body;

    // Validate productOptionId
    if (!isValidObjectId(productOptionId)) {
        throw new ApiError(400, "Invalid productOptionId");
    }

    // Validate presence of required fields
    if (!ProductName || !Tops || !Edges || !Finish) {
        throw new ApiError(400, "ProductName and options are required");
    }

    // Find the existing product option by ID
    const productOption = await Productoption.findById(productOptionId);

    if (!productOption) {
        throw new ApiError(404, "No product option found");
    }

    // Delete old images and upload new ones
    const topsimgtodelete = productOption.Tops.map(top => top.topsimg.public_id);
    const edgeimgtodelete = productOption.Edges.map(edge => edge.edgesimg.public_id);
    const finishimgtodelete = productOption.Finish.map(finish => finish.finishimg.public_id);

    const topsImages = [];
    const edgesImages = [];
    const finishesImages = [];

    // Process and upload new images for Tops
    for (let i = 0; i < Tops.length; i++) {
        const topsEntry = Tops[i];
        const topImages = req.files?.[`Tops[${i}][topsimg]`];

        if (!topImages || !topImages.length) {
            throw new ApiError(400, `No images found for Tops[${i}][topsimg]`);
        }

        const processedImages = await Promise.all(topImages.map(async file => {
            const topsimgLocalPath = file.path;
            const topImg = await uploadOnCloudinary(topsimgLocalPath);
            if (!topImg) {
                throw new ApiError(400, "Failed to upload Tops image");
            }

            return {
                topname: topsEntry.topname,
                topsimg: { url: topImg.url, public_id: topImg.public_id }
            };
        }));

        topsImages.push(...processedImages);
    }


    for (let i = 0; i < Edges.length; i++) {
        const edgesEntry = Edges[i];
        const edgeImages = req.files?.[`Edges[${i}][edgesimg]`];

        if (!edgeImages || !edgeImages.length) {
            throw new ApiError(400, `No images found for Edges[${i}][edgesimg]`);
        }

        const processedImages = await Promise.all(edgeImages.map(async file => {
            const edgesimgLocalPath = file.path;
            const edgeImg = await uploadOnCloudinary(edgesimgLocalPath);
            if (!edgeImg) {
                throw new ApiError(400, "Failed to upload Edges image");
            }

            return {
                edgename: edgesEntry.edgename,
                edgesimg: { url: edgeImg.url, public_id: edgeImg.public_id }
            };
        }));

        edgesImages.push(...processedImages);
    }


    for (let i = 0; i < Finish.length; i++) {
        const finishEntry = Finish[i];
        const finishImages = req.files?.[`Finish[${i}][finishimg]`];

        if (!finishImages || !finishImages.length) {
            throw new ApiError(400, `No images found for Finish[${i}][finishimg]`);
        }

        const processedImages = await Promise.all(finishImages.map(async file => {
            const finishimgLocalPath = file.path;
            const finishImg = await uploadOnCloudinary(finishimgLocalPath);
            if (!finishImg) {
                throw new ApiError(400, "Failed to upload finish image");
            }

            return {
                finishname: finishEntry.finishname,
                finishimg: { url: finishImg.url, public_id: finishImg.public_id }
            };
        }));

        finishesImages.push(...processedImages);
    }



    // Update product option with new details
    const updatedProductOption = await Productoption.findByIdAndUpdate(
        productOptionId,
        {
            ProductName,
            Tops: topsImages,
            Edges: edgesImages,
            Finish: finishesImages
        },
        { new: true }
    );

    if (!updatedProductOption) {
        throw new ApiError(500, "Failed to update product option, please try again");
    }

    // Delete old images from Cloudinary
    await Promise.all([
        ...topsimgtodelete.map(public_id => deleteOnCloudinary(public_id)),
        ...edgeimgtodelete.map(public_id => deleteOnCloudinary(public_id)),
        ...finishimgtodelete.map(public_id => deleteOnCloudinary(public_id))
    ]);

    return res.status(200).json(new ApiResponse(200, updatedProductOption, "Product option updated successfully"));
});

const deleteProductOption = asyncHandler(async (req, res) => {

    const { productOptionId } = req.params

    if (!isValidObjectId(productOptionId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const productOption = await Productoption.findById(productOptionId);


    if (!productOption) {
        throw new ApiError(404, "No product found");
    }


    const topsimgtodelete = productOption.Tops.map(top => top.topsimg.public_id);
    const edgeimgtodelete = productOption.Edges.map(edge => edge.edgesimg.public_id);
    const finishimgtodelete = productOption.Finish.map(finish => finish.finishimg.public_id);

    const deleteProduct = await Productoption.findByIdAndDelete(productOptionId);

    if (!deleteProduct) {
        throw new ApiError(500, "Failed to delete product please try again");
    }

    await Promise.all([
        ...topsimgtodelete.map(public_id => deleteOnCloudinary(public_id)),
        ...edgeimgtodelete.map(public_id => deleteOnCloudinary(public_id)),
        ...finishimgtodelete.map(public_id => deleteOnCloudinary(public_id))
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, deleteProduct, "Product deleted successfully"));
})



export {
    addProductOption,
    getProductOption,
    updateProductOptionDetails,
    deleteProductOption
}