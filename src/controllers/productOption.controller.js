import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Productoption } from "../models/productOption.model.js"
import { deleteImage } from "../utils/deleteImg.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addProductOption = asyncHandler(async (req, res) => {
    const { productid } = req.params;

    if (!isValidObjectId(productid)) {
        throw new ApiError(400, "Invalid productid");
    }

    const productsetAlready = await Productoption.findOne({ ProductID: productid });

    if (productsetAlready) {
        return res.status(200).json(new ApiResponse(200, "Product is already set"));
    }

    

    // Function to map options from request body and files
    const mapOptions = (field, req) => {
        const options = [];
        let index = 0;
        while (req.body[`${field}[${index}].name`]) {
            const name = req.body[`${field}[${index}].name`];
            const displayImageFile = req.files[`${field}[${index}].displayImage`];
            const imagesFiles = req.files[`${field}[${index}].images`] || [];
            
            const displayImage = displayImageFile ? `./public/temp/${displayImageFile[0].filename}` : null;
            const images = imagesFiles.map(file => ({ url: `./public/temp/${file.filename}` }));
            
            options.push({
                name: name,
                displayImage: { url: displayImage },
                images: images
            });
            
            index++;
        }
        return options;
    };

    
    const topsOptions = mapOptions('Tops', req);
    // const edgesOptions = mapOptions('Edges', req);
    // const finishOptions = mapOptions('Finish', req);

    // if (!topsOptions.length || !edgesOptions.length || !finishOptions.length) {
    if (!topsOptions.length) {
        throw new ApiError(400, "At least one top, edge, and finish are required");
    }

    const productOption = await Productoption.create({
        ProductID: productid,
        Tops: topsOptions,
        // Edges: edgesOptions,
        // Finish: finishOptions
    });

    return res.status(201).json(new ApiResponse(200, productOption, "Product options added successfully"));
});

const getProductOption = asyncHandler(async (req, res) => {
    const productOption = await Productoption.find()

    if (!productOption) {
        return res.status(200).json(
             new ApiResponse(200, "product Options are not found")
         )
     }

    else if (productOption.length > 0) {
       return res.status(201).json(
            new ApiResponse(200, productOption, "product Options fetched successfully")
        )
    }

    else {
       return res.status(201).json(
            new ApiResponse(200, "currantly have not any product Options")
        )
    }
})

const getProductOptionById = asyncHandler(async (req, res) => {
    const { productOptionId } = req.params;


    if (!productOptionId) {
        throw new ApiError(400, "Product Option ID is missing");
    }

    const productOption = await Productoption.findById(productOptionId);

    if (!productOption) {
        throw new ApiError(404, "Product Option not found");
    }

    return res.status(200).json(new ApiResponse(200, productOption, "Product Option fetched successfully"));
});

const updateProductOptionDetails = asyncHandler(async (req, res) => {
    const { productOptionId } = req.params;

    // Validate productOptionId
    if (!isValidObjectId(productOptionId)) {
        throw new ApiError(400, "Invalid productOptionId");
    }

    // Find the existing product option by ID
    const productOption = await Productoption.findById(productOptionId);

    if (!productOption) {
        return res.status(200).json(new ApiResponse(200, "No product option found"));
    }

    // Collect all old image URLs for deletion if they are being updated
    const oldImageUrls = [];

    // Function to map updated options from request body and files
    const mapUpdatedOptions = (field, req, existingOptions) => {
        return existingOptions.map((existingOption, index) => {
            const name = req.body[`${field}[${index}].name`] || existingOption.name;
            const displayImageFile = req.files[`${field}[${index}].displayImage`];
            const imagesFiles = req.files[`${field}[${index}].images`] || [];

            let displayImage = existingOption.displayImage.url;
            if (displayImageFile) {
                displayImage = `./public/temp/${displayImageFile[0].filename}`;
                oldImageUrls.push(existingOption.displayImage.url);
            }

            let images = existingOption.images;
            if (imagesFiles.length) {
                images = imagesFiles.map(file => ({ url: `./public/temp/${file.filename}` }));
                existingOption.images.forEach(img => oldImageUrls.push(img.url));
            }

            return {
                name,
                displayImage: { url: displayImage },
                images
            };
        });
    };

    const updatedTops = mapUpdatedOptions('Tops', req, productOption.Tops);
    // const updatedEdges = mapUpdatedOptions('Edges', req, productOption.Edges);
    // const updatedFinish = mapUpdatedOptions('Finish', req, productOption.Finish);

    // Update product option with new details
    const updatedProductOption = await Productoption.findByIdAndUpdate(
        productOptionId,
        {
            $set: {
                Tops: updatedTops,
                // Edges: updatedEdges,
                // Finish: updatedFinish
            }
        },
        { new: true }
    );

    if (!updatedProductOption) {
        throw new ApiError(500, "Failed to update product option, please try again");
    }

    // Delete old images
    await Promise.all(oldImageUrls.map(url => deleteImage(url)));

    return res.status(200).json(new ApiResponse(200, updatedProductOption, "Product option updated successfully"));
});


const deleteProductOption = asyncHandler(async (req, res) => {
    const { productOptionId } = req.params;

    if (!isValidObjectId(productOptionId)) {
        throw new ApiError(400, "Invalid product option ID");
    }

    const productOption = await Productoption.findById(productOptionId);

    if (!productOption) {
        throw new ApiError(404, "No product option found");
    }

    const deleteOldImages = async (images) => {
        return await Promise.all(images.map(async (url) => {
            try {
                await deleteImage(url);
            } catch (error) {
                console.error(`Failed to delete image at ${url}: ${error.message}`);
            }
        }));
    };

    const topsImagesToDelete = productOption.Tops.flatMap(top => [
        top.displayImage.url,
        ...top.images.map(img => img.url)
    ]);

    // const edgesImagesToDelete = productOption.Edges.flatMap(edge => [
    //     edge.displayImage.url,
    //     ...edge.images.map(img => img.url)
    // ]);

    // const finishesImagesToDelete = productOption.Finish.flatMap(finish => [
    //     finish.displayImage.url,
    //     ...finish.images.map(img => img.url)
    // ]);

    const deletedProductOption = await Productoption.findByIdAndDelete(productOptionId);

    if (!deletedProductOption) {
        throw new ApiError(500, "Failed to delete product option, please try again");
    }

    await Promise.all([
        deleteOldImages(topsImagesToDelete),
        // deleteOldImages(edgesImagesToDelete),
        // deleteOldImages(finishesImagesToDelete)
    ]);

    return res.status(200).json(new ApiResponse(200, deletedProductOption, "Product option deleted successfully"));
});




export {
    addProductOption,
    getProductOption,
    updateProductOptionDetails,
    deleteProductOption,
    getProductOptionById
}