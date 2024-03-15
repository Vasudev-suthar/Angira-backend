import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Aboutus } from "../models/aboutus.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addAboutus = asyncHandler(async (req, res) => {
    const { aboutus } = req.body;

    if (!aboutus) {
        throw new ApiError(400, "aboutus required");
    }

    const about = await Aboutus.findOne({ aboutus });
    if (about) {
        throw new ApiError(400, "aboutus already exists");
    }

    const newAboutus = await Aboutus.create({
        aboutus
    })

    if (!newAboutus) {
        throw new ApiError(500, "Something went wrong while adding Aboutus")
    }

    return res.status(201).json(
        new ApiResponse(200, newAboutus, "Aboutus added Successfully")
    )
})

const getAboutus = asyncHandler(async (req, res) => {
    const aboutus = await Aboutus.find()

    if (!aboutus) {
        throw new ApiError(400, "aboutus are not found")
    }

    else if (aboutus.length > 0) {
        res.status(201).json(
            new ApiResponse(200, aboutus, "aboutus fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any aboutus")
        )
    }
})

const updateAboutus = asyncHandler(async (req, res) => {
    const { aboutusId } = req.params
    const { aboutus } = req.body;

    if (!isValidObjectId(aboutusId)) {
        throw new ApiError(400, "Invalid aboutusId");
    }

    if (!aboutus) {
        throw new ApiError(400, "aboutus are required");
    }

    const about = await Aboutus.findById(aboutusId);

    if (!about) {
        throw new ApiError(404, "No aboutus found");
    }

    const updateaboutus = await Aboutus.findByIdAndUpdate(
        aboutusId,
        {
            $set: {
                aboutus
            }
        },
        { new: true }
    );

    if (!updateaboutus) {
        throw new ApiError(500, "Failed to update about us please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateaboutus, "About us updated successfully"));
})

const deleteAboutus = asyncHandler(async (req, res) => {
    const { aboutusId } = req.params

    if (!isValidObjectId(aboutusId)) {
        throw new ApiError(400, "Invalid aboutusId");
    }

    const aboutus = await Aboutus.findById(aboutusId);

    if (!aboutus) {
        throw new ApiError(404, "No about us found");
    }

    const deleteaboutus = await Aboutus.findByIdAndDelete(aboutusId);

    if (!deleteaboutus) {
        throw new ApiError(500, "Failed to delete about us please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteaboutus, "About us deleted successfully"));
})


export {
    addAboutus,
    getAboutus,
    updateAboutus,
    deleteAboutus
}