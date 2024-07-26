import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {Finish} from "../models/finish.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addFinish = asyncHandler(async (req, res) => {

    const { finishName } = req.body

    if (!finishName) {
        throw new ApiError(400, "finishName is required");
    }

    const finish = await Finish.findOne({ finishName });
    if (finish) {
        throw new ApiError(400, "finish already exists");
    }

    const newfinish = await Finish.create({
        finishName
    })

    if (!newfinish) {
        throw new ApiError(500, "Something went wrong while adding finish")
    }

    return res.status(201).json(
        new ApiResponse(200, newfinish, "finish added Successfully")
    )

})

const getFinish = asyncHandler(async (req, res) => {
    const finishes = await Finish.find()

    if (!finishes) {
        throw new ApiError(400, "finishes are not found")
    }

    else if (finishes.length > 0) {
       return res.status(201).json(
            new ApiResponse(200, finishes, "finishes fetched successfully")
        )
    }

    else {
       return res.status(201).json(
            new ApiResponse(200, "currantly have not any finishes")
        )
    }
})

const updateFinish = asyncHandler(async (req, res) => {

    const { finishId } = req.params
    const { finishName } = req.body;

    if (!isValidObjectId(finishId)) {
        throw new ApiError(400, "Invalid finishId");
    }

    if (!finishName) {
        throw new ApiError(400, "finishName is required");
    }

    const finish = await Finish.findById(finishId);

    if (!finish) {
        throw new ApiError(404, "No finish found");
    }

    const updatefinish = await Finish.findByIdAndUpdate(
        finishId,
        {
            $set: {
                finishName
            }
        },
        { new: true }
    );

    if (!updatefinish) {
        throw new ApiError(500, "Failed to update finish please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatefinish, "finish updated successfully"));
})

const deleteFinish = asyncHandler(async (req, res) => {

    const { finishId } = req.params

    if (!isValidObjectId(finishId)) {
        throw new ApiError(400, "Invalid finishId");
    }

    const finish = await Finish.findById(finishId);

    if (!finish) {
        throw new ApiError(404, "No finish found");
    }

    const deletefinish = await Finish.findByIdAndDelete(finishId);

    if (!deletefinish) {
        throw new ApiError(500, "Failed to delete finish please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletefinish, "finish deleted successfully"));
})

const searchFinish = asyncHandler(async (req, res) => {

    const finishes = await Finish.find({
        "$or": [
            { finishName: { $regex: (req.params.key, 'i') } }
        ]
    })

    if (!finishes) {
        throw new ApiError(400, "finishes are not found")
    }

    else if (finishes.length > 0) {
       return res.status(201).json(
            new ApiResponse(200, finishes, "finishes fetched successfully")
        )
    }

    else {
       return res.status(201).json(
            new ApiResponse(200, "currantly have not any finishes")
        )
    }
})



export {
    addFinish,
    getFinish,
    updateFinish,
    deleteFinish,
    searchFinish
}